// backend/src/routes/authRoutes.js
// Este arquivo contém rotas para autenticação (registro, login)
// e para o usuário gerenciar SEU PRÓPRIO PERFIL, endereços, métodos de pagamento e favoritos.
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    registerUser, loginUser, getUserProfile, updateUserProfile, 
    addPaymentMethod, deletePaymentMethod,
    getUserFavorites, addFavoriteProduct, removeFavoriteProduct,
} = require('../controllers/authController');

// --- Rotas de Autenticação (Públicas) ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Rotas de Perfil do Usuário (Protegidas) ---
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// --- Rotas de Métodos de Pagamento do Usuário (Protegidas) ---
router.post('/payment-methods', protect, addPaymentMethod);
router.delete('/payment-methods/:methodId', protect, deletePaymentMethod);

// --- Rotas de Favoritos do Usuário (Protegidas) ---
router.get('/me/favorites', protect, getUserFavorites);
router.post('/favorites', protect, addFavoriteProduct);
router.delete('/favorites/:productId', protect, removeFavoriteProduct);

module.exports = router;