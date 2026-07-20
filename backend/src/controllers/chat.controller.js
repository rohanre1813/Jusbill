import Invoice from "../models/invoice.js";
import Purchase from "../models/purchase.js";
import Product from "../models/product.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // Free, fast Llama 3.1 model

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

  const paidInvoices = invoices.filter(inv => inv.paymentStatus === "Paid").slice(0, 15);
  const unpaidInvoices = invoices.filter(inv => inv.paymentStatus !== "Paid").slice(0, 15);

  const paidSummary = paidInvoices.map(inv =>
    `${inv.invoiceId} | ${inv.customerName} | ₹${inv.grandTotal} | ${new Date(inv.createdAt).toLocaleDateString()}`
  ).join("\n");

  const unpaidSummary = unpaidInvoices.map(inv =>
    `${inv.invoiceId} | ${inv.customerName} | ₹${inv.grandTotal} | ${new Date(inv.createdAt).toLocaleDateString()}`
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
    productSummary, paidSummary, unpaidSummary, purchaseSummary
  };
};

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "Groq API key not configured" });

    const data = await getShopContext(req.user.shopId);

    const systemContent = `You are JusBill AI, a highly capable, professional, and analytical business assistant for a shop owner. Your primary job is to help the shop owner understand their business performance, sales, inventory, and profits using the exact data provided below.

CORE INSTRUCTIONS:
1. DATA STRICTNESS: You must base your answers ONLY on the provided "SHOP DATA SUMMARY", "PRODUCTS", "RECENT PAID SALES", "RECENT UNPAID SALES", and "RECENT PURCHASES". Do NOT hallucinate, guess, or invent numbers. If the data to answer a question is missing, clearly state: "I don't have enough data to answer that."
2. TONE & STYLE: Be polite, encouraging, and highly professional. Use markdown formatting to make your responses easy to read (use bullet points, bold text for key metrics, and short paragraphs).
3. CURRENCY: Always format money in Indian Rupees using the ₹ symbol and Indian comma placement (e.g., ₹1,50,000).
4. PROFIT ANALYSIS: When discussing profit, clearly distinguish between "Realized Profit" (money actually in the bank from paid sales) and "Projected Profit" (potential profit if all pending invoices are collected). Advise the owner if unpaid invoices are dragging down their realized profit.
5. BOUNDARIES: You are a business assistant. If the user asks about unrelated topics (like coding, history, or general knowledge), politely decline and steer the conversation back to their shop's data.

Here is the current live data for the shop:

SHOP DATA SUMMARY:
- Total Products: ${data.totalProducts}
- Total Sales: ₹${data.totalSales.toLocaleString("en-IN")}
- Received (Paid): ₹${data.totalPaid.toLocaleString("en-IN")}
- Pending (Unpaid): ₹${data.totalUnpaid.toLocaleString("en-IN")}
- Total Purchases (Expenses): ₹${data.totalPurchases.toLocaleString("en-IN")}
- Realized Profit (Based only on Money Received): ₹${(data.totalPaid - data.totalPurchases).toLocaleString("en-IN")}
- Projected Profit (If all pending invoices get paid): ₹${(data.totalSales - data.totalPurchases).toLocaleString("en-IN")}

PRODUCTS:
${data.productSummary || "No products found."}

RECENT PAID SALES (MONEY RECEIVED):
${data.paidSummary || "No paid invoices found."}

RECENT UNPAID SALES (PENDING PAYMENT):
${data.unpaidSummary || "No pending invoices found."}

RECENT PURCHASES:
${data.purchaseSummary || "No purchases found."}`;

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
