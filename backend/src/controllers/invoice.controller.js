import Invoice from "../models/invoice.js";
import Product from "../models/product.js";
import Counter from "../models/counter.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";
import puppeteer from "puppeteer";
import { redis, getKey } from "../config/redis.js";
import { clearCache } from "../middleware/cache.js";
import { generateSalesReportPdf } from "../utils/pdfGenerator.js";
import { fetchWithCache } from "../utils/cacheHelper.js";

export const createInvoice = async (req, res) => {
  try {
    const { items, customerName } = req.body;

    let subtotal = 0;
    const finalItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      product.stock -= item.qty;
      product.sold = (product.sold || 0) + item.qty;
      await product.save();

      finalItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        total: product.price * item.qty
      });

      subtotal += product.price * item.qty;
    }

    const discountValue = req.body.discount || 0;
    const discountAmount = subtotal * (discountValue / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const gstRate = req.body.gstRate ?? 18;
    const gst = subtotalAfterDiscount * (gstRate / 100);

    const counter = await Counter.findOneAndUpdate(
      { shopId: req.user.shopId, type: "invoice" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const invoiceId = `INV-${String(counter.seq).padStart(4, '0')}`;

    const invoice = await Invoice.create({
      shopId: req.user.shopId,
      invoiceId,
      customerName,
      customerEmail: req.body.customerEmail || "",
      customerAddress: req.body.customerAddress,
      customerMobile: req.body.customerMobile,
      customerGstin: req.body.customerGstin,
      customerState: req.body.customerState,
      description: req.body.description,
      items: finalItems,
      subtotal,
      discount: discountValue,
      discountAmount,
      gstRate,
      gst,
      grandTotal: subtotalAfterDiscount + gst
    });

    // Non-blocking cache invalidation
    clearCache(`invoices:${req.user.shopId}`).catch(() => {});
    clearCache(`products:${req.user.shopId}`).catch(() => {});
    clearCache(`analytics:${req.user.shopId}`).catch(() => {});

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Failed to create invoice", error: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const { search: searchQuery } = req.query;

    const response = await fetchWithCache(`invoices:${req.user.shopId}:${searchQuery || "all"}`, 300, async () => {
      const query = { shopId: req.user.shopId };

      if (searchQuery) {
        query.$or = [
          { invoiceId: { $regex: searchQuery, $options: "i" } },
          { customerName: { $regex: searchQuery, $options: "i" } }
        ];
      }

      // Run both queries in parallel — stats via aggregation (no large doc fetch)
      const [invoices, [statsResult]] = await Promise.all([
        Invoice.find(query).sort({ createdAt: -1 }),
        Invoice.aggregate([
          { $match: { shopId: req.user.shopId } },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$grandTotal" },
              totalReceived: {
                $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$grandTotal", 0] }
              },
              totalPending: {
                $sum: { $cond: [{ $ne: ["$paymentStatus", "Paid"] }, "$grandTotal", 0] }
              }
            }
          }
        ])
      ]);

      const stats = statsResult
        ? { totalSales: statsResult.totalSales, totalReceived: statsResult.totalReceived, totalPending: statsResult.totalPending }
        : { totalSales: 0, totalReceived: 0, totalPending: 0 };

      return { invoices, stats };
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Paid", "Unpaid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const existingInvoice = await Invoice.findOne({ _id: id, shopId: req.user.shopId });
    if (!existingInvoice) return res.status(404).json({ message: "Invoice not found" });

    if (existingInvoice.paymentStatus === "Paid" && status === "Unpaid") {
      return res.status(400).json({ message: "Cannot revert a Paid invoice to Unpaid" });
    }

    existingInvoice.paymentStatus = status;
    const invoice = await existingInvoice.save();
    try {
      await clearCache(`invoices:${req.user.shopId}`);
    } catch (redisError) {
      console.error("Redis Clear Error (updatePaymentStatus):", redisError.message);
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status" });
  }
};



export const sendInvoiceEmail = async (req, res) => {
  try {
    const { email, customerName, invoiceId, pdfBuffer, type = "Invoice" } = req.body;

    if (!email || !pdfBuffer) {
      return res.status(400).json({ message: "Missing email or PDF data" });
    }

    const docLabel = type === "Estimate" ? "Estimate/Quotation" : "Invoice";
    let subject, text;

    if (type === "Reminder") {
      subject = `Payment Reminder: Invoice ${invoiceId} from ${req.user.companyName || "JusBill"}`;
      text = `Hello ${customerName},\n\nThis is a friendly reminder that the payment for Invoice ${invoiceId} is pending.\n\nPlease find the invoice attached for your reference.\n\nRegards,\n${req.user.companyName || "JusBill"}`;
    } else {
      subject = `${docLabel} ${invoiceId || "Ref"} from ${req.user.companyName || "JusBill"}`;
      text = `Hello ${customerName},\n\nPlease find attached the ${docLabel} for your reference.\n\nRegards,\n${req.user.companyName || "JusBill"}`;
    }

    const buffer = Buffer.from(pdfBuffer, 'base64');
    const filenamePrefix = type === "Reminder" ? "Invoice" : type;

    // Send in background
    sendEmailWithAttachment(email, subject, text, buffer, `${filenamePrefix}_${invoiceId || "Draft"}.pdf`)
      .catch(err => console.error("Background Email Error:", err));

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};


export const sendSalesReport = async (req, res) => {
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

    const reportInvoices = await Invoice.find(query).sort({ createdAt: -1 });

    let totalSales = 0, totalPaid = 0, totalUnpaid = 0;
    for (const inv of reportInvoices) {
      totalSales += (inv.grandTotal || 0);
      if (inv.paymentStatus === "Paid") totalPaid += (inv.grandTotal || 0);
      else totalUnpaid += (inv.grandTotal || 0);
    }


    const pdfBuffer = await generateSalesReportPdf(periodLabel, totalSales, totalPaid, totalUnpaid, reportInvoices);

    // Send in background
    sendEmailWithAttachment(
      req.user.email,
      `Sales Report (${periodLabel})`,
      `Attached is your sales report for the period: ${periodLabel}.`,
      pdfBuffer,
      `Sales_Report_${fromDate || 'All'}_to_${toDate || 'Time'}.pdf`
    ).catch(err => console.error("Background Report Email Error:", err));

    res.json({ message: "Report generated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send report", error: error.message });
  }
};
