import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/product.js";
import Invoice from "./src/models/invoice.js";
import Customer from "./src/models/customer.js";

dotenv.config();

const checkIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB via", process.env.MONGO_URI);

    console.log("\n--- Product Indexes ---");
    const productIndexes = await Product.listIndexes();
    console.table(productIndexes);

    console.log("\n--- Invoice Indexes ---");
    const invoiceIndexes = await Invoice.listIndexes();
    console.table(invoiceIndexes);

    console.log("\n--- Customer Indexes ---");
    const customerIndexes = await Customer.listIndexes();
    console.table(customerIndexes);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error checking indexes:", error);
    process.exit(1);
  }
};

checkIndexes();
