import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    shopId: String,
    invoiceId: { type: String },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerName: String,
    customerEmail: String,
    customerAddress: String,
    customerMobile: String,
    customerGstin: String,
    customerState: String,
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        qty: Number,
        total: Number
      }
    ],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    gstRate: { type: Number, default: 18 },
    gst: Number,
    grandTotal: Number,
    paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    description: String
  },
  { timestamps: true }
);

invoiceSchema.index({ shopId: 1, createdAt: -1 });
invoiceSchema.index({ shopId: 1, customerName: 1 });
invoiceSchema.index({ shopId: 1, invoiceId: 1 }, { unique: true });

export default mongoose.model("Invoice", invoiceSchema);
