import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  shopId: { type: String, required: true },
  type: { type: String, required: true }, // 'invoice' or 'purchase'
  seq: { type: Number, default: 0 }
});

counterSchema.index({ shopId: 1, type: 1 }, { unique: true });

export default mongoose.model("Counter", counterSchema);
