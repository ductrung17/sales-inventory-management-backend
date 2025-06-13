const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    status: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },
    paymentMethod: {
      type: String,
      enum: ["Chuyển khoản", "Thanh toán khi nhận hàng"],
      default: "Thanh toán khi nhận hàng",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
