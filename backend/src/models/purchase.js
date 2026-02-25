import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    shopId: String,
    purchaseId: { type: String, unique: true },
    supplierName: String,
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        purchasePrice: Number,
        qty: Number,
        total: Number
      }
    ],
    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
