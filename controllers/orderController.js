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
    const search = req.query.search || "";
    const regex = new RegExp(search, "i"); // không phân biệt hoa thường

    const orders = await Order.find({
      $or: [
        { orderNumber: { $regex: regex } },
        { customerName: { $regex: regex } },
        { "shippingAddress.street": { $regex: regex } },
        { "shippingAddress.city": { $regex: regex } },
        { "shippingAddress.country": { $regex: regex } },
      ],
    });

    res.json(orders);
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

const getDeliveryStatus = (req, res) => {
  const deliveryStatusEnum = Order.schema.path("deliveryStatus").enumValues;
  res.json(deliveryStatusEnum);
};
const getStatus = (req, res) => {
  const statusEnum = Order.schema.path("status").enumValues;
  res.json(statusEnum);
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    res.json(order);
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết đơn hàng." });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  getDeliveryStatus,
  getStatus,
  getOrderById,
};
