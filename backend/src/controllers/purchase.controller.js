import Purchase from "../models/purchase.js";
import Product from "../models/product.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";
import puppeteer from "puppeteer";

export const createPurchase = async (req, res) => {
  try {
    const { items, supplierName, totalAmount } = req.body;

    const count = await Purchase.countDocuments({ shopId: req.user.shopId });
    const purchaseId = `PUR-${String(count + 1).padStart(4, '0')}`;

    const purchase = await Purchase.create({
      shopId: req.user.shopId,
      purchaseId,
      supplierName,
      items,
      totalAmount
    });

    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.qty },
          $set: { purchasePrice: item.purchasePrice }
        });
      }
    }

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Failed to create purchase record", error: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ shopId: req.user.shopId }).sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findOne({ _id: id, shopId: req.user.shopId });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase record not found" });
    }

    for (const item of purchase.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } });
      }
    }

    await Purchase.findByIdAndDelete(id);
    res.json({ message: "Purchase deleted and stock reverted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete purchase", error: error.message });
  }
};

export const sendPurchaseReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    const query = { shopId: req.user.shopId };
    let periodLabel = "All Time";

    if (fromDate && toDate) {
      const start = new Date(fromDate + "T00:00:00");
      const end = new Date(toDate + "T23:59:59.999");
      query.createdAt = { $gte: start, $lte: end };
      periodLabel = `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;
    }

    const reportPurchases = await Purchase.find(query).sort({ createdAt: -1 });

    if (reportPurchases.length === 0) {
      return res.status(400).json({ message: "No purchases found in this date range" });
    }

    const totalExpenses = reportPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; color: #4f46e5; margin-bottom: 5px; }
            p.date { text-align: center; color: #666; font-size: 12px; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; }
            th { background-color: #f3f4f6; color: #374151; font-weight: 600; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .total-row { font-weight: bold; background-color: #eef2ff; }
            .summary-box { text-align: center; margin-bottom: 20px; padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; }
            .summary-val { font-size: 18px; font-weight: bold; color: #111827; }
          </style>
        </head>
        <body>
          <h1>Purchase History Report</h1>
          <p class="date">Generated on: ${new Date().toLocaleString()}</p>
          <p class="date">Period: ${periodLabel}</p>
          <div class="summary-box">
            Total Expenses: <span class="summary-val">₹${totalExpenses.toLocaleString('en-IN')}</span>
          </div>
          <h3>🛒 Detailed Purchase History</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Date</th><th>Supplier</th><th>Items</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${reportPurchases.map(p => `
                <tr>
                  <td>${p.purchaseId}</td>
                  <td>${new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>${p.supplierName || "-"}</td>
                  <td>${p.items.map(i => `${i.name} (${i.qty})`).join(", ")}</td>
                  <td style="text-align: right;">₹${p.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              `).join("")}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">Total Expense</td>
                <td style="text-align: right;">₹${totalExpenses.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 30px; font-size: 11px; color: #888; text-align: center;">End of Report</p>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    sendEmailWithAttachment(
      req.user.email,
      `Purchase Report (${periodLabel})`,
      `Attached is your purchase report for the period: ${periodLabel}.`,
      pdfBuffer,
      `Purchase_Report_${fromDate || 'All'}_to_${toDate || 'Time'}.pdf`
    ).catch(err => console.error("Purchase report email failed:", err));

    res.json({ message: "Report generated successfully" });
  } catch (error) {
    console.error("Send Report Error:", error);
    res.status(500).json({ message: "Failed to process request", error: error.message });
  }
};
