// controllers/paymentController.js
const PDFDocument = require("pdfkit");
const Payment = require("../models/Payment");
const path = require("path");

const getAllPaymentsWithOrder = async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || "";

    // Lấy tất cả payment và populate order
    const payments = await Payment.find().populate("order");

    // Nếu có search query thì lọc lại theo orderNumber hoặc customerName
    const filteredPayments = payments.filter((payment) => {
      const order = payment.order;
      if (!order) return false;

      return (
        order.orderNumber?.toLowerCase().includes(search) ||
        order.customerName?.toLowerCase().includes(search)
      );
    });

    res.status(200).json(filteredPayments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPaymentMethod = (req, res) => {
  const paymentMethodEnum = Payment.schema.path("paymentMethod").enumValues;
  res.json(paymentMethodEnum);
};

const getStatus = (req, res) => {
  const statusEnum = Payment.schema.path("status").enumValues;
  res.json(statusEnum);
};

const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
      return res
        .status(400)
        .json({ error: "Thiếu orderId hoặc paymentMethod" });
    }

    // Kiểm tra đã có payment cho order này chưa
    const existingPayment = await Payment.findOne({ order: orderId });
    if (existingPayment) {
      return res.status(400).json({ error: "Đơn hàng này đã được thanh toán" });
    }

    const payment = await Payment.create({ order: orderId, paymentMethod });
    res.status(201).json(payment);
  } catch (err) {
    console.error("Lỗi tạo payment:", err);
    res.status(500).json({ error: "Lỗi server khi tạo thanh toán" });
  }
};

const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id).populate("order");

    if (!payment || !payment.order) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy đơn thanh toán hoặc đơn hàng." });
    }
    if (payment.status !== "Đã thanh toán") {
      return res
        .status(400)
        .json({ error: "Chỉ in hóa đơn cho đơn đã thanh toán." });
    }
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const fontPath = path.join(__dirname, "../fonts/DejaVuSans.ttf");
    doc.font(fontPath);

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice_${payment.order.orderNumber}.pdf`
    );

    doc.pipe(res);

    // --- HEADER ---
    doc
      .fontSize(20)
      .text("HÓA ĐƠN THANH TOÁN", { align: "center" })
      .moveDown(0.5);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // --- THÔNG TIN ĐƠN HÀNG ---
    doc.fontSize(12);

    doc.text(`Mã đơn hàng: ${payment.order.orderNumber}`);
    doc.text(`Khách hàng: ${payment.order.customerName}`);
    doc.text(
      `Ngày đặt: ${new Date(payment.order.date).toLocaleDateString("vi-VN")}`
    );
    doc.text(`Trạng thái: ${payment.status}`);
    doc.text(
      `Tổng tiền: ${payment.order.totalAmount.toLocaleString("vi-VN")} đ`
    );

    doc.moveDown(2);

    // --- Footer ---
    doc
      .fontSize(12)
      .text("Cảm ơn quý khách đã sử dụng dịch vụ!", { align: "center" })
      .moveDown(0.5)
      .text(`Ngày in hóa đơn: ${new Date().toLocaleDateString("vi-VN")}`, {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error("Lỗi tạo hóa đơn PDF:", err);
    res.status(500).json({ error: "Lỗi tạo hóa đơn PDF" });
  }
};
module.exports = {
  getAllPaymentsWithOrder,
  getPaymentMethod,
  createPayment,
  updatePayment,
  getStatus,
  deletePayment,
  generateInvoice,
};
