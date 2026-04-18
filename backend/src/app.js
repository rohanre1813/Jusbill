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
import chatRoutes from "./routes/chat.routes.js";

dotenv.config({ path: "./.env" });
connectDB();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/invoice", invoiceRoutes);
apiRouter.use("/customers", customerRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/purchases", purchaseRoutes);
apiRouter.use("/chat", chatRoutes);

app.use("/api", apiRouter);

export default app;
