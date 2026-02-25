import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shopId: String,
    name: String,
    price: Number,
    purchasePrice: { type: Number, default: 0 },
    stock: Number,
    unit: String,
    description: String,
    sold: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.index({ shopId: 1, name: 1 });
productSchema.index({ shopId: 1, price: 1 });

export default mongoose.model("Product", productSchema);
