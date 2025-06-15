// backend/src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Importa o middleware de proteção
const {
    getUserCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearUserCart
} = require('../controllers/cartController'); // Importa as funções do controlador

// Todas estas rotas são protegidas pelo middleware 'protect'
router.get('/', protect, getUserCart); // GET /api/cart (Obter o carrinho do usuário logado)
router.post('/add', protect, addToCart); // POST /api/cart/add (Adicionar/Atualizar item no carrinho)
router.delete('/remove/:productId', protect, removeFromCart); // DELETE /api/cart/remove/:productId (Remover item)
router.put('/update-quantity', protect, updateCartItemQuantity); // PUT /api/cart/update-quantity (Atualizar quantidade de item)
router.delete('/clear', protect, clearUserCart); // DELETE /api/cart/clear (Limpar todo o carrinho)

module.exports = router;