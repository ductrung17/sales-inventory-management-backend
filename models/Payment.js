const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Chưa thanh toán", "Đã hoàn thành"],
      default: "Chưa thanh toán",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
