// backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware'); // Importa middleware de proteção
const {
    createOrder,
    getMyOrders,
    getOrderById
} = require('../controllers/orderController');

router.post('/', protect, createOrder);        // POST /api/orders (Criar um pedido)
router.get('/myorders', protect, getMyOrders); // GET /api/orders/myorders (Obter pedidos do usuário logado)
router.get('/:id', protect, getOrderById);     // GET /api/orders/:id (Obter um pedido específico)

module.exports = router;