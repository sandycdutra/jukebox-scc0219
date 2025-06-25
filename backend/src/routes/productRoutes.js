// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware'); // Importa o middleware 'admin'
const {
    getProducts, getProductById, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');

// Rotas públicas (leitura de produtos)
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, admin, createProduct); // Criar produto: APENAS ADMIN

// Isso permite que usuários autenticados (clientes) atualizem o estoque ao fazer uma compra.
router.put('/:id', protect, updateProduct); 

router.delete('/:id', protect, admin, deleteProduct); // Deletar produto: APENAS ADMIN

module.exports = router;