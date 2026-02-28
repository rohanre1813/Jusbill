import Invoice from "../models/invoice.js";
import Purchase from "../models/purchase.js";
import Product from "../models/product.js";

const HF_MODEL = "google/gemma-2-2b-it";
const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// Fetch shop data summaries for context
const getShopContext = async (shopId) => {
  const [products, invoices, purchases] = await Promise.all([
    Product.find({ shopId }).select("name price stock unit sold purchasePrice"),
    Invoice.find({ shopId }).sort({ createdAt: -1 }).limit(50).select("invoiceId customerName grandTotal paymentStatus createdAt"),
    Purchase.find({ shopId }).sort({ createdAt: -1 }).limit(50).select("purchaseId supplierName totalAmount createdAt")
  ]);

  const productSummary = products.map(p =>
    `${p.name}: Price ₹${p.price}, Stock ${p.stock} ${p.unit || "units"}, Sold ${p.sold || 0}, Purchase Price ₹${p.purchasePrice || 0}`
  ).join("\n");

  let totalSales = 0, totalPaid = 0, totalUnpaid = 0;
  for (const inv of invoices) {
    totalSales += inv.grandTotal || 0;
    if (inv.paymentStatus === "Paid") totalPaid += inv.grandTotal || 0;
    else totalUnpaid += inv.grandTotal || 0;
  }

  const invoiceSummary = invoices.slice(0, 20).map(inv =>
    `${inv.invoiceId} | ${inv.customerName} | ₹${inv.grandTotal} | ${inv.paymentStatus} | ${new Date(inv.createdAt).toLocaleDateString()}`
  ).join("\n");

  let totalPurchases = 0;
  for (const pur of purchases) totalPurchases += pur.totalAmount || 0;

  const purchaseSummary = purchases.slice(0, 20).map(pur =>
    `${pur.purchaseId} | ${pur.supplierName || "N/A"} | ₹${pur.totalAmount} | ${new Date(pur.createdAt).toLocaleDateString()}`
  ).join("\n");

  return {
    totalProducts: products.length,
    totalInvoices: invoices.length,
    totalPurchaseRecords: purchases.length,
    totalSales, totalPaid, totalUnpaid, totalPurchases,
    productSummary, invoiceSummary, purchaseSummary
  };
};

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "HuggingFace API key not configured" });

    const data = await getShopContext(req.user.shopId);

    const systemText = `You are JusBill AI, a business assistant. Answer only questions about the shop's business data below. Be concise, use bullet points, format currency in ₹. Do not make up data.

SHOP DATA:
- Products: ${data.totalProducts}
- Total Sales: ₹${data.totalSales.toLocaleString("en-IN")}
- Received (Paid): ₹${data.totalPaid.toLocaleString("en-IN")}
- Pending (Unpaid): ₹${data.totalUnpaid.toLocaleString("en-IN")}
- Total Purchases: ₹${data.totalPurchases.toLocaleString("en-IN")}
- Profit Estimate: ₹${(data.totalSales - data.totalPurchases).toLocaleString("en-IN")}

PRODUCTS:
${data.productSummary || "None"}

RECENT SALES (INVOICES):
${data.invoiceSummary || "None"}

RECENT PURCHASES:
${data.purchaseSummary || "None"}`;

    // Build prompt in Gemma chat format
    let prompt = `<start_of_turn>user\n${systemText}\n\nAnswer the following question based on the data above.<end_of_turn>\n<start_of_turn>model\nUnderstood! I will only answer based on your shop data.<end_of_turn>\n`;

    // Add recent history (last 10 messages to keep prompt short)
    if (history && Array.isArray(history)) {
      const recent = history.slice(-10);
      for (const msg of recent) {
        if (msg.role === "user") {
          prompt += `<start_of_turn>user\n${msg.content}<end_of_turn>\n`;
        } else {
          prompt += `<start_of_turn>model\n${msg.content}<end_of_turn>\n`;
        }
      }
    }

    prompt += `<start_of_turn>user\n${message}<end_of_turn>\n<start_of_turn>model\n`;

    // Call HuggingFace Inference API
    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("HuggingFace API Error:", result);
      return res.status(500).json({ message: "AI service error", error: result.error });
    }

    const aiResponse = result[0]?.generated_text?.trim() || "Sorry, I could not generate a response.";

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Failed to process chat", error: error.message });
  }
};
