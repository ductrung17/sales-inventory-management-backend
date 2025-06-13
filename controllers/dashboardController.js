const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    // Lấy tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    // Lấy tổng số đơn hàng
    const totalOrders = await Order.countDocuments();

    // Lấy tổng doanh thu từ các đơn đã hoàn thành
    const completedOrders = await Order.find({ status: "Đã hoàn thành" });
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error("Lỗi khi lấy thống kê dashboard:", err.message);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = { getDashboardStats };
