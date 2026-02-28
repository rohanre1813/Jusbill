import Invoice from "../models/invoice.js";
import Purchase from "../models/purchase.js";
import Product from "../models/product.js";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Fetch shop data summaries for context
const getShopContext = async (shopId) => {
  const [products, invoices, purchases] = await Promise.all([
    Product.find({ shopId }).select("name price stock unit sold purchasePrice"),
    Invoice.find({ shopId }).sort({ createdAt: -1 }).limit(50).select("invoiceId customerName grandTotal paymentStatus createdAt items"),
    Purchase.find({ shopId }).sort({ createdAt: -1 }).limit(50).select("purchaseId supplierName totalAmount createdAt items")
  ]);

  // Build product summary
  const productSummary = products.map(p =>
    `${p.name}: Price ₹${p.price}, Stock ${p.stock} ${p.unit || "units"}, Sold ${p.sold || 0}, Purchase Price ₹${p.purchasePrice || 0}`
  ).join("\n");

  // Build sales summary
  let totalSales = 0, totalPaid = 0, totalUnpaid = 0;
  for (const inv of invoices) {
    totalSales += inv.grandTotal || 0;
    if (inv.paymentStatus === "Paid") totalPaid += inv.grandTotal || 0;
    else totalUnpaid += inv.grandTotal || 0;
  }

  const invoiceSummary = invoices.slice(0, 20).map(inv =>
    `${inv.invoiceId} | ${inv.customerName} | ₹${inv.grandTotal} | ${inv.paymentStatus} | ${new Date(inv.createdAt).toLocaleDateString()}`
  ).join("\n");

  // Build purchase summary
  let totalPurchases = 0;
  for (const pur of purchases) {
    totalPurchases += pur.totalAmount || 0;
  }

  const purchaseSummary = purchases.slice(0, 20).map(pur =>
    `${pur.purchaseId} | ${pur.supplierName || "N/A"} | ₹${pur.totalAmount} | ${new Date(pur.createdAt).toLocaleDateString()}`
  ).join("\n");

  return {
    totalProducts: products.length,
    totalInvoices: invoices.length,
    totalPurchaseRecords: purchases.length,
    totalSales,
    totalPaid,
    totalUnpaid,
    totalPurchases,
    productSummary,
    invoiceSummary,
    purchaseSummary
  };
};

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Gemini API key not configured" });
    }

    // Get shop-specific data
    const data = await getShopContext(req.user.shopId);

    // Build system prompt with shop data
    const systemPrompt = `You are JusBill AI, a smart business assistant for a shop/business. You help the owner understand their sales, purchases, inventory, and overall business performance.

IMPORTANT RULES:
- Only answer questions related to the shop's business data.
- Be concise but helpful. Use bullet points and numbers.
- Format currency in Indian Rupees (₹).
- If data is insufficient to answer, say so clearly.
- Do not make up data. Only use what is provided below.
- Be friendly and professional.

SHOP DATA SUMMARY:
- Total Products: ${data.totalProducts}
- Total Invoices (recent 50): ${data.totalInvoices}
- Total Purchase Records (recent 50): ${data.totalPurchaseRecords}
- Total Sales: ₹${data.totalSales.toLocaleString("en-IN")}
- Received (Paid): ₹${data.totalPaid.toLocaleString("en-IN")}
- Pending (Unpaid): ₹${data.totalUnpaid.toLocaleString("en-IN")}
- Total Purchases (Expenses): ₹${data.totalPurchases.toLocaleString("en-IN")}
- Profit Estimate: ₹${(data.totalSales - data.totalPurchases).toLocaleString("en-IN")}

PRODUCTS:
${data.productSummary || "No products found."}

RECENT INVOICES (Sales):
${data.invoiceSummary || "No invoices found."}

RECENT PURCHASES (Expenses):
${data.purchaseSummary || "No purchases found."}`;

    // Build conversation for Gemini
    const contents = [];

    // Add system instruction as first user message
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({ role: "model", parts: [{ text: "Understood! I'm JusBill AI, ready to help you with your business data. What would you like to know?" }] });

    // Add chat history (last 100 messages)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-100);
      for (const msg of recentHistory) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }
    }

    // Add current message
    contents.push({ role: "user", parts: [{ text: message }] });

    // Call Gemini API
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", result);
      return res.status(500).json({ message: "AI service error", error: result.error?.message });
    }

    const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response.";

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Failed to process chat", error: error.message });
  }
};
