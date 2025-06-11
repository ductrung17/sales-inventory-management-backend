const Product = require("../models/Product");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      customerName,
      deliveryDeadline,
      shippingAddress,
      items,
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Đơn hàng cần ít nhất 1 sản phẩm." });
    }

    const newOrder = new Order({
      orderNumber,
      customerName,
      deliveryDeadline,
      shippingAddress,
      totalAmount,
      items,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Đơn hàng đã được tạo thành công", order: newOrder });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ error: "Lỗi server khi tạo đơn hàng" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getAllOrders, updateOrder };
