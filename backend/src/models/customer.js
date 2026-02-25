import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: String,
    gstin: String
  },
  { timestamps: true }
);

customerSchema.index({ shopId: 1 });
customerSchema.index({ name: 'text', mobile: 'text', email: 'text' });
customerSchema.index({ shopId: 1, mobile: 1 }, { unique: true });
customerSchema.index({ shopId: 1, email: 1 }, { unique: true });

export default mongoose.model("Customer", customerSchema);
