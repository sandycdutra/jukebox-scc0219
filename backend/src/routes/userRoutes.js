// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Seu middleware

// Importe TODAS as funções do controlador de usuário
const {
    getMe,              
    updateUserProfile,  
    addAddressToProfile,    
    deleteAddressFromProfile, 
    addPaymentMethodToProfile, 
    deletePaymentMethodFromProfile,
    // funções de favoritos
    getUserFavorites,     
    addFavoriteProduct,   
    removeFavoriteProduct,
} = require('../controllers/userController');

// --- Rotas de Perfil do Usuário ---

// @route   GET /api/users/me
// @desc    Get user profile data (including addresses and payment methods)
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/users/profile
// @desc    Update user profile data (e.g., name, email, phone)
// @access  Private
router.put('/profile', protect, updateUserProfile);

// --- Rotas de Endereço ---

// @route   PUT /api/users/profile/address
// @desc    Add a new address to the user's profile
// @access  Private
router.put('/profile/address', protect, addAddressToProfile);

// @route   DELETE /api/users/profile/address/:addressId
// @desc    Delete an address from the user's profile
// @access  Private
router.delete('/profile/address/:addressId', protect, deleteAddressFromProfile);

// --- Rotas de Método de Pagamento ---

// @route   PUT /api/users/profile/payment
// @desc    Add a new payment method to the user's profile
// @access  Private
router.put('/profile/payment', protect, addPaymentMethodToProfile);

// @route   DELETE /api/users/profile/payment/:paymentId
// @desc    Delete a payment method from the user's profile
// @access  Private
router.delete('/profile/payment/:paymentId', protect, deletePaymentMethodFromProfile);

// --- NOVAS Rotas de Favoritos ---

// @route   GET /api/users/me/favorites
// @desc    Obter favoritos do usuário logado (detalhes completos dos produtos)
// @access  Private
router.get('/me/favorites', protect, getUserFavorites); 

// @route   POST /api/users/favorites
// @desc    Adicionar produto aos favoritos do usuário logado
// @access  Private
router.post('/favorites', protect, addFavoriteProduct); // <-- Rota ajustada para /api/users/favorites

// @route   DELETE /api/users/favorites/:productId
// @desc    Remover produto dos favoritos do usuário logado
// @access  Private
router.delete('/favorites/:productId', protect, removeFavoriteProduct);

module.exports = router;