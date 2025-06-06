const express = require('express');
const router = express.Router();
const { handleRegister, handleLogin, getProfile } = require('../controllers/userController')
const authenticateToken = require('../middlewares/authMiddleware')
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
router.use(express.json());

router.get('/', (req, res) => {
    res.send("Home Page")
})

router.post('/api/register', handleRegister);
router.post('/api/login', handleLogin);
router.get('/api/profile', authenticateToken, getProfile);

router.post('/api/products', createProduct);
router.get('/api/products', authenticateToken, getAllProducts);
router.get('/api/products/:id', authenticateToken, getProductById);
router.put('/api/products/:id', updateProduct);
router.delete('/api/products/:id', authenticateToken, deleteProduct);

module.exports = router;