import puppeteer from "puppeteer";

export const generateSalesReportPdf = async (periodLabel, totalSales, totalPaid, totalUnpaid, reportInvoices) => {
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
          .summary-box { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; }
          .summary-item { text-align: center; }
          .summary-val { font-size: 18px; font-weight: bold; color: #111827; display: block; margin-top: 5px; }
          .text-green { color: #10b981; }
          .text-red { color: #ef4444; }
        </style>
      </head>
      <body>
        <h1>Sales Report</h1>
        <p class="date">Generated on: ${new Date().toLocaleString()}</p>
        <p class="date">Period: ${periodLabel}</p>
        <div class="summary-box">
          <div class="summary-item">Total Sales<span class="summary-val">₹${totalSales.toLocaleString('en-IN')}</span></div>
          <div class="summary-item">Received<span class="summary-val text-green">₹${totalPaid.toLocaleString('en-IN')}</span></div>
          <div class="summary-item">Pending<span class="summary-val text-red">₹${totalUnpaid.toLocaleString('en-IN')}</span></div>
        </div>
        <h3>📑 Detailed Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th><th>Date</th><th>Customer</th><th>Status</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${reportInvoices.map(inv => `
              <tr>
                <td>${inv.invoiceId}</td>
                <td>${new Date(inv.createdAt).toLocaleDateString()}</td>
                <td>${inv.customerName}</td>
                <td style="color: ${inv.paymentStatus === 'Paid' ? '#10b981' : '#ef4444'}">${inv.paymentStatus}</td>
                <td style="text-align: right;">₹${inv.grandTotal.toLocaleString('en-IN')}</td>
              </tr>
            `).join("")}
            <tr class="total-row">
              <td colspan="4" style="text-align: right;">Total</td>
              <td style="text-align: right;">₹${totalSales.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: 30px; font-size: 11px; color: #888; text-align: center;">End of Report</p>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
};

export const generatePurchaseReportPdf = async (periodLabel, totalExpenses, reportPurchases) => {
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

  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
};
