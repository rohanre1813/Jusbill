import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import userRoutes from "./routes/user.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";

dotenv.config({ path: "./.env" });
connectDB();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173"];

console.log("CORS allowed origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/health/redis", async (req, res) => {
  try {
    const { redis } = await import("./config/redis.js");
    const result = await redis.ping();
    res.json({ status: "ok", redis: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/customers", customerRoutes);
app.use("/users", userRoutes);
app.use("/purchases", purchaseRoutes);

// Email Diagnostic Route
app.get("/test-email", async (req, res) => {
  try {
    const { sendEmailWithAttachment } = await import("./utils/emailService.js");
    await sendEmailWithAttachment(
      process.env.EMAIL_USER,
      "Test Connectivity",
      "If you received this, SMTP is working!",
      Buffer.from("Test content"),
      "test.txt"
    );
    res.json({ message: "Test email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

export default app;
