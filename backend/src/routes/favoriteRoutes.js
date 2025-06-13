// backend/src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
// <--- IMPORTE O MIDDLEWARE DE PROTEÇÃO AQUI
const { protect } = require('../middlewares/authMiddleware');
const {
    getUserFavorites,
    addFavoriteProduct,
    removeFavoriteProduct
} = require('../controllers/favoriteController');

// Todas estas rotas são protegidas pelo middleware 'protect'
// O middleware 'protect' é adicionado como um argumento ANTES do controlador final.
router.get('/me/favorites', protect, getUserFavorites);
router.post('/favorites', protect, addFavoriteProduct);
router.delete('/favorites/:productId', protect, removeFavoriteProduct);

module.exports = router;