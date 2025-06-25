// backend/src/routes/authRoutes.js
// Este arquivo contém rotas para autenticação (registro, login)
// e para o usuário gerenciar SEU PRÓPRIO PERFIL, endereços, métodos de pagamento e favoritos.
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Apenas 'protect'
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    addPaymentMethod, 
    deletePaymentMethod,
    getUserFavorites, 
    addFavoriteProduct, 
    removeFavoriteProduct,
} = require('../controllers/authController');

// --- Rotas de Autenticação (Públicas) ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Rotas de Perfil do Usuário (Protegidas APENAS por 'protect') ---
// O próprio usuário acessa e atualiza seu perfil.
// Não tem o middleware 'admin' aqui.
router.get('/profile', protect, getUserProfile); // GET /api/auth/profile
router.put('/profile', protect, updateUserProfile); // PUT /api/auth/profile

// --- Rotas de Métodos de Pagamento do Usuário (Protegidas APENAS por 'protect') ---
// O próprio usuário gerencia seus métodos de pagamento.
// Não tem o middleware 'admin' aqui.
router.post('/payment-methods', protect, addPaymentMethod); // POST /api/auth/payment-methods
router.delete('/payment-methods/:methodId', protect, deletePaymentMethod); // DELETE /api/auth/payment-methods/:methodId


router.get('/me/favorites', protect, getUserFavorites); 
router.post('/favorites', protect, addFavoriteProduct);
router.delete('/favorites/:productId', protect, removeFavoriteProduct);

module.exports = router;