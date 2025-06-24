// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    getAllUsers, getUserById, updateUserByAdmin, deleteUser,
} = require('../controllers/userController');

// Todas estas rotas são protegidas por 'protect' e 'admin'
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUserByAdmin);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;