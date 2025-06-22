// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  handleRegister,
  handleLogin,
  getProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const paymentController = require("../controllers/paymentController");
const reportController = require("../controllers/reportController");
const dashboardController = require("../controllers/dashboardController");
const userController = require("../controllers/userController");

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
router.get("/api/profile", authMiddleware.authenticateToken, getProfile);

// Product routes
router.post(
  "/api/products",
  upload.single("image"),
  productController.createProduct
);

router.get(
  "/api/products",
  authMiddleware.authenticateToken,
  productController.getAllProducts
);

router.get(
  "/api/products/:id",
  authMiddleware.authenticateToken,
  productController.getProductById
);

router.put(
  "/api/products/:id",
  upload.single("image"),
  productController.updateProduct
);

router.delete(
  "/api/products/:id",
  authMiddleware.authenticateToken,
  productController.deleteProduct
);

//Orders
router.post("/api/orders", orderController.createOrder);
router.get(
  "/api/orders",
  authMiddleware.authenticateToken,
  orderController.getAllOrders
);
router.put(
  "/api/orders/:id",
  authMiddleware.authenticateToken,
  orderController.updateOrder
);
router.get("/api/delivery-statuses", orderController.getDeliveryStatus);
router.get("/api/statuses", orderController.getStatus);
router.get("/api/orders/:id", orderController.getOrderById);

//Payment
router.get(
  "/api/payments",
  authMiddleware.authenticateToken,
  paymentController.getAllPaymentsWithOrder
);
router.get("/api/payment-method", paymentController.getPaymentMethod);
router.get("/api/payment-statuses", paymentController.getStatus);
router.post("/api/payments", paymentController.createPayment);
router.put(
  "/api/payments/:id",
  authMiddleware.authenticateToken,
  paymentController.updatePayment
);
router.delete(
  "/api/payments/:id",
  authMiddleware.authenticateToken,
  paymentController.deletePayment
);

//Report
router.get(
  "/api/revenue",
  authMiddleware.authenticateToken,
  authMiddleware.authorizeRoles("manager"),
  reportController.getRevenueReport
);

//User
router.get(
  "/api/users",
  authMiddleware.authenticateToken,
  // authMiddleware.authorizeRoles("manager"),
  userController.getAllUsers
);
router.put(
  "/api/users/:id",
  authMiddleware.authenticateToken,
  authMiddleware.authorizeRoles("manager"),
  userController.updateUser
);
router.get("/api/role", userController.getRoles);
router.get(
  "/api/users/:id",
  authMiddleware.authenticateToken,
  // authMiddleware.authorizeRoles("manager"),
  userController.getUserById
);

router.get("/api/payments/:id/invoice", paymentController.generateInvoice);

// Home
router.get(
  "/api",
  authMiddleware.authenticateToken,
  dashboardController.getDashboardStats
);

module.exports = router;
