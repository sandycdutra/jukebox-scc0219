// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { registerUser, loginUser, getUserProfile, updateUserProfile, addPaymentMethod, deletePaymentMethod } = require('../controllers/authController'); // NOVO: importando

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/payment-methods', protect, addPaymentMethod); // Adicionar método de pagamento
router.delete('/payment-methods/:methodId', protect, deletePaymentMethod); // Deletar método de pagamento

module.exports = router;