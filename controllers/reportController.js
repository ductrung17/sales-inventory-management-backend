const Payment = require("../models/Payment");

const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Bao trùm hết ngày kết thúc

    const payments = await Payment.find({
      createdAt: { $gte: start, $lte: end },
    }).populate("order");

    const totalRevenue = payments.reduce((sum, p) => {
      return sum + (p.order?.totalAmount || 0);
    }, 0);

    const totalOrders = payments.length;

    const revenueByDate = {};
    payments.forEach((p) => {
      const day = p.order.date.toISOString().split("T")[0];
      revenueByDate[day] =
        (revenueByDate[day] || 0) + (p.order?.totalAmount || 0);
    });

    res.status(200).json({
      totalRevenue,
      totalOrders,
      revenueByDate,
      payments,
    });
  } catch (err) {
    console.error("Lỗi khi tạo báo cáo:", err.message);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = { getRevenueReport };
