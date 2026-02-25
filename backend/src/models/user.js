import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    shopId: String,
    role: { type: String, default: "owner" },
    companyName: String,
    mobile: { type: String, unique: true },
    secondaryMobile: String,
    address: String,
    state: String,
    gstin: String,
    profileImage: String,
    qrCode: String,
    bankName: String,
    bankAccount: String,
    ifscCode: String,
    financialSnapshot: {
      lastSales: { type: Number, default: 0 },
      lastReceived: { type: Number, default: 0 },
      lastPending: { type: Number, default: 0 },
      lastSnapshotDate: { type: Date, default: null }
    },
    salesSnapshot: {
      lastSales: { type: Number, default: 0 },
      lastPaid: { type: Number, default: 0 },
      lastUnpaid: { type: Number, default: 0 },
      lastResetDate: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
