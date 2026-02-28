import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    shopId: String,
    purchaseId: { type: String },
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

purchaseSchema.index({ shopId: 1, purchaseId: 1 }, { unique: true });

export default mongoose.model("Purchase", purchaseSchema);
