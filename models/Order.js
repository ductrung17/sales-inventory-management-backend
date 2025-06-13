const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, default: "Vietnam" },
    },
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true },
    deliveryDeadline: { type: Date, required: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["Đang xử lý", "Đã hoàn thành", "Đã hủy"],
      default: "Đang xử lý",
    },
    deliveryStatus: {
      type: String,
      enum: ["Đang xử lý", "Đã gửi hàng", "Giao thành công", "Trả hàng"],
      default: "Đang xử lý",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
