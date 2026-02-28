import Invoice from "../models/invoice.js";
import Purchase from "../models/purchase.js";
import Product from "../models/product.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // Free, fast Llama 3.1 model

// Fetch shop data summaries for context
const getShopContext = async (shopId) => {
  const [products, invoices, purchases] = await Promise.all([
    Product.find({ shopId }).select("name price stock unit sold purchasePrice"),
    Invoice.find({ shopId, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(50).select("invoiceId customerName grandTotal paymentStatus createdAt"),
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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "Groq API key not configured" });

    const data = await getShopContext(req.user.shopId);

    const systemContent = `You are JusBill AI, a smart business analyst for a shop owner. You have access to the shop's real business data below. Use it to answer questions, do calculations, give recommendations, analyze trends, and help the owner make better decisions.

Be analytical, insightful, and practical. Format currency in ₹. Use bullet points or tables when helpful. If asked for recommendations, give them based on the data — don't hold back.

Only avoid making up data that isn't in the context below. Everything else you can reason, calculate, and infer freely.

--- SHOP DATA ---

Products (name | sell price | stock | sold | purchase price):
${data.productSummary || "No products."}

Invoices/Sales (id | customer | total | status | date):
${data.invoiceSummary || "No invoices."}

Purchases (id | supplier | total | date):
${data.purchaseSummary || "No purchases."}

Totals:
- Total Sales: ₹${data.totalSales}
- Paid: ₹${data.totalPaid}, Unpaid: ₹${data.totalUnpaid}
- Total Purchase Cost: ₹${data.totalPurchases}`;

    // Build messages array
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

    messages.push({ role: "user", content: message });

    // Call Groq API
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API Error:", error);
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
