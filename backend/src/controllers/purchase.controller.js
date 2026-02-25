import Purchase from "../models/purchase.js";
import Product from "../models/product.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";
import PDFDocument from "pdfkit";
import { redis, getKey } from "../config/redis.js";
import { clearCache } from "../middleware/cache.js";

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

    await purchase.save();
    try {
      await clearCache(`purchases:${req.user.shopId}`);
    } catch (redisError) {
      console.error("Redis Clear Error (createPurchase):", redisError.message);
    }
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Failed to create purchase record", error: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const cacheKey = getKey(`purchases:${req.user.shopId}`);
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("Redis Cache Hit: purchases");
        return res.json(cached);
      }
    } catch (redisError) {
      console.error("Redis Get Error (purchases):", redisError.message);
    }

    const purchases = await Purchase.find({ shopId: req.user.shopId }).sort({ createdAt: -1 });
    try {
      await redis.set(cacheKey, purchases, { ex: 3600 });
      console.log("Redis Cache Miss: purchases. Cached result.");
    } catch (redisError) {
      console.error("Redis Set Error (purchases):", redisError.message);
    }
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
    try {
      await clearCache(`purchases:${req.user.shopId}`);
    } catch (redisError) {
      console.error("Redis Clear Error (deletePurchase):", redisError.message);
    }
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
    console.log(`Found ${reportPurchases.length} purchases for report.`);

    if (reportPurchases.length === 0) {
      return res.status(400).json({ message: "No purchases found in this date range" });
    }

    const totalExpenses = reportPurchases.reduce((sum, p) => sum + p.totalAmount, 0);


    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];
      doc.on("data", chunk => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(18).font("Helvetica-Bold").text("Purchase Report", { align: "center" });
      doc.fontSize(10).font("Helvetica").text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
      doc.text(`Period: ${periodLabel}`, { align: "center" });
      doc.moveDown();

      doc.fontSize(11).font("Helvetica-Bold").text("Summary");
      doc.font("Helvetica").fontSize(10);
      doc.text(`Total Expenses: Rs.${totalExpenses.toLocaleString("en-IN")}`);
      doc.moveDown();

      doc.fontSize(11).font("Helvetica-Bold").text("Purchases");
      doc.moveDown(0.5);

      const colX = [40, 120, 200, 310, 420];
      doc.fontSize(9).font("Helvetica-Bold");
      ["Purchase ID", "Date", "Supplier", "Items", "Amount"].forEach((h, i) => doc.text(h, colX[i], doc.y, { continued: i < 4 }));
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(9);

      reportPurchases.forEach(p => {
        if (doc.y > 650) {
          doc.addPage();
          doc.fontSize(9).font("Helvetica-Bold");
          ["Purchase ID", "Date", "Supplier", "Items", "Amount"].forEach((h, i) => doc.text(h, colX[i], doc.y, { continued: i < 4 }));
          doc.moveDown(0.3);
          doc.font("Helvetica").fontSize(9);
        }
        const y = doc.y;
        const itemsSummary = p.items.map(it => `${it.name} (x${it.qty})`).join(", ");
        doc.text(p.purchaseId, colX[0], y, { continued: false });
        doc.text(new Date(p.createdAt).toLocaleDateString(), colX[1], y, { continued: false });
        doc.text(p.supplierName || "-", colX[2], y, { continued: false });
        doc.text(itemsSummary, colX[3], y, { width: 90, continued: false });
        doc.text(`Rs.${p.totalAmount.toLocaleString("en-IN")}`, colX[4], y, { continued: false });
        doc.moveDown(0.5);
      });

      doc.moveDown();
      doc.font("Helvetica-Bold").text(`Total Expense: Rs.${totalExpenses.toLocaleString("en-IN")}`, { align: "right" });
      doc.end();
    });

    // Send in background
    sendEmailWithAttachment(
      req.user.email,
      `Purchase Report (${periodLabel})`,
      `Attached is your purchase report for the period: ${periodLabel}.`,
      pdfBuffer,
      `Purchase_Report_${fromDate || 'All'}_to_${toDate || 'Time'}.pdf`
    ).catch(err => console.error("Background Purchase Email Error:", err));

    res.json({ message: "Report generated successfully" });
  } catch (error) {
    console.error("Send Report Error:", error);
    res.status(500).json({ message: "Failed to process request", error: error.message });
  }
};
