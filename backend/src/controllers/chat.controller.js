import Invoice from "../models/invoice.js";
import Purchase from "../models/purchase.js";
import Product from "../models/product.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // Free, fast Llama 3.1 model

// Fetch raw shop data for Groq summarization
const getShopContext = async (shopId) => {
  const [products, invoices, purchases] = await Promise.all([
    Product.find({ shopId }).select("name price stock unit sold purchasePrice").lean(),
    Invoice.find({ shopId }).sort({ createdAt: -1 }).limit(50).select("invoiceId customerName grandTotal paymentStatus createdAt").lean(),
    Purchase.find({ shopId }).sort({ createdAt: -1 }).limit(50).select("purchaseId supplierName totalAmount createdAt").lean()
  ]);

  return { products, invoices, purchases };
};

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "Groq API key not configured" });

    const rawData = await getShopContext(req.user.shopId);

    // Call 1: Send raw JSON to Groq to calculate and summarize
    const summaryResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{
          role: "system",
          content: `You are an internal data analyzer. Analyze this JSON data for a business. Calculate total sales (sum of invoices grandTotal), total purchases, profit, and summarize top items. Provide a clear, concise text summary. Data: ${JSON.stringify(rawData)}`
        }],
        max_tokens: 700,
        temperature: 0.1,
        stream: false
      })
    });

    if (!summaryResponse.ok) {
      const error = await summaryResponse.text();
      console.error("Groq Summary Error:", error);
      return res.status(500).json({ message: "AI summarization error", error });
    }

    const summaryResult = await summaryResponse.json();
    const dataSummary = summaryResult.choices?.[0]?.message?.content?.trim() || "No summary generated.";

    // Call 2: Final response based on the generated summary
    const systemContent = `You are JusBill AI, a smart business assistant. Answer only questions about the shop's business data provided below. Be concise, use bullet points, and format currency in Indian Rupees (₹). Do not make up data. If you don't have enough data to answer, say so clearly.

SHOP DATA SUMMARY:
${dataSummary}`;

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
