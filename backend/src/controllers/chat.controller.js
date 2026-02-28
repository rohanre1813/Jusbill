import Invoice from "../models/invoice.js";
import Purchase from "../models/purchase.js";
import Product from "../models/product.js";

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
const HF_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/v1/chat/completions`;

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

    const systemContent = `You are JusBill AI, a business assistant. Answer only questions about the shop's business data below. Be concise, use bullet points, format currency in ₹. Do not make up data.

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

    // Build messages array in OpenAI format
    const messages = [{ role: "system", content: systemContent }];

    // Add recent chat history (last 10 messages)
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        });
      }
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    // Call HuggingFace chat completions endpoint
    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages,
        max_tokens: 512,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("HuggingFace API Error:", error);
      return res.status(500).json({ message: "AI service error", error });
    }

    const result = await response.json();
    const aiResponse = result.choices?.[0]?.message?.content?.trim() || "Sorry, I could not generate a response.";

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Failed to process chat", error: error.message });
  }
};
