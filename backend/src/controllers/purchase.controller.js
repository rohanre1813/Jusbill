import Purchase from "../models/purchase.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";
import { redis, getKey } from "../config/redis.js";
import { clearCache } from "../middleware/cache.js";
import { generatePurchaseReportPdf } from "../utils/pdfGenerator.js";
import { fetchWithCache } from "../utils/cacheHelper.js";
import Counter from "../models/counter.js";

export const createPurchase = async (req, res) => {
  try {
    const { items, supplierName, totalAmount } = req.body;

    const counter = await Counter.findOneAndUpdate(
      { shopId: req.user.shopId, type: "purchase" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const purchaseId = `PUR-${String(counter.seq).padStart(4, '0')}`;

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


    try {
      await clearCache(`purchases:${req.user.shopId}`);
      await clearCache(`products:${req.user.shopId}`);
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
    const purchases = await fetchWithCache(`purchases:${req.user.shopId}`, 3600, async () => {
      return await Purchase.find({ shopId: req.user.shopId }).sort({ createdAt: -1 });
    });
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

    // Decrement purchase counter so next purchase reuses the freed ID
    await Counter.findOneAndUpdate(
      { shopId: req.user.shopId, type: "purchase" },
      { $inc: { seq: -1 } }
    );

    try {
      await clearCache(`purchases:${req.user.shopId}`);
      await clearCache(`products:${req.user.shopId}`);
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


    const pdfBuffer = await generatePurchaseReportPdf(periodLabel, totalExpenses, reportPurchases);

    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      return res.status(400).json({ message: "User email not found" });
    }

    // Send in background
    sendEmailWithAttachment(
      user.email,
      `Purchase Report (${periodLabel})`,
      `Attached is your purchase report for the period: ${periodLabel}.`,
      pdfBuffer,
      `Purchase_Report_${fromDate || 'All'}_to_${toDate || 'Time'}.pdf`
    ).catch(err => console.error("Background Report Email Error:", err));

    res.json({ message: "Report generated successfully" });
  } catch (error) {
    console.error("Send Report Error:", error);
    res.status(500).json({ message: "Failed to process request", error: error.message });
  }
};
