import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "./src/models/customer.js";

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const collection = Customer.collection;

    console.log("Listing current indexes...");
    const indexes = await collection.indexes();
    console.table(indexes);

    // Drop old global unique indexes if they exist
    // Usually named mobile_1 and email_1
    try {
      if (indexes.find(i => i.name === "mobile_1")) {
        console.log("Dropping global mobile_1 index...");
        await collection.dropIndex("mobile_1");
      }
      if (indexes.find(i => i.name === "email_1")) {
        console.log("Dropping global email_1 index...");
        await collection.dropIndex("email_1");
      }
    } catch (e) {
      console.log("Index drop error (ignorable if not found):", e.message);
    }

    console.log("Syncing indexes to apply new compound constraints...");
    await Customer.syncIndexes();

    console.log("Indexes Fixed Successfully!");

    console.log("\n--- New Indexes ---");
    console.table(await collection.indexes());

    await mongoose.disconnect();
  } catch (error) {
    console.error("Fix Index Error:", error);
    process.exit(1);
  }
};

fixIndexes();
