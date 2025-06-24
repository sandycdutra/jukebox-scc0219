// backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware'); // Importa middleware de proteção
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrder, 
    deleteOrder 
} = require('../controllers/orderController');

router.post('/', protect, createOrder);        // POST /api/orders (Criar um pedido)
router.get('/myorders', protect, getMyOrders); // GET /api/orders/myorders (Obter pedidos do usuário logado)
router.get('/:id', protect, getOrderById);     // GET /api/orders/:id (Obter um pedido específico)
// Rotas de Admin para Pedidos
router.get('/admin/orders', protect, admin, getAllOrders); // GET todos os pedidos (Admin)
router.put('/:id', protect, admin, updateOrder); // PUT para atualizar pedido (Admin)
router.delete('/:id', protect, admin, deleteOrder); // DELETE para deletar pedido (Admin)

module.exports = router;