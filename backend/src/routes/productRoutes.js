// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    getProducts, getProductById, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');

// Rotas públicas (leitura de produtos)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rotas protegidas por Admin (escrita de produtos)
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;