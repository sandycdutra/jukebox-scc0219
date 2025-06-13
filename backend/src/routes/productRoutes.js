// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct // <--- Caminho corrigido e padrão
} = require('../controllers/productController'); // <--- Caminho corrigido e padrão

// Rotas públicas de leitura
router.get('/', getProducts); // GET /api/products
router.get('/:id', getProductById); // GET /api/products/:id

// Rotas de escrita (futuramente protegidas por admin)
router.post('/', createProduct); // POST /api/products
router.put('/:id', updateProduct); // PUT /api/products/:id (para atualizar estoque, etc.)

module.exports = router;