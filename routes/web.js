// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  handleRegister,
  handleLogin,
  getProfile,
} = require("../controllers/userController");

const authenticateToken = require("../middlewares/authMiddleware");

const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const paymentController = require("../controllers/paymentController");
const reportController = require("../controllers/reportController");
const dashboardController = require("../controllers/dashboardController");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Auth routes
router.post("/api/register", handleRegister);
router.post("/api/login", handleLogin);
router.get("/api/profile", authenticateToken, getProfile);

// Product routes
router.post(
  "/api/products",
  upload.single("image"),
  productController.createProduct
);

router.get(
  "/api/products",
  authenticateToken,
  productController.getAllProducts
);

router.get(
  "/api/products/:id",
  authenticateToken,
  productController.getProductById
);

router.put(
  "/api/products/:id",
  upload.single("image"),
  productController.updateProduct
);

router.delete(
  "/api/products/:id",
  authenticateToken,
  productController.deleteProduct
);

router.post("/api/orders", orderController.createOrder);
router.get("/api/orders", authenticateToken, orderController.getAllOrders);
router.put("/api/orders/:id", authenticateToken, orderController.updateOrder);
router.get("/api/delivery-statuses", orderController.getDeliveryStatus);
router.get("/api/statuses", orderController.getStatus);
// router.get("api/:id", orderController.getOrderById);

router.get(
  "/api/payments",
  authenticateToken,
  paymentController.getAllPaymentsWithOrder
);
router.get("/api/payment-method", paymentController.getPaymentMethod);
router.get("/api/payment-statuses", paymentController.getStatus);
router.post("/api/payments", paymentController.createPayment);
router.put(
  "/api/payments/:id",
  authenticateToken,
  paymentController.updatePayment
);
router.delete(
  "/api/payments/:id",
  authenticateToken,
  paymentController.deletePayment
);

//Report
router.get("/api/revenue", reportController.getRevenueReport);

// Home
router.get("/api", dashboardController.getDashboardStats);

module.exports = router;
