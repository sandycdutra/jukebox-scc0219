// backend/src/controllers/userController.js
// Este controlador é para que um ADMIN gerencie OUTROS usuários no sistema.
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

// @desc    Obter TODOS os usuários (apenas para Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -favorite_products');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to get all users', error: error.message });
    }
};

// @desc    Obter um único usuário pelo ID (apenas para Admin)
// @route   GET /api/admin/users/:id (onde :id é o _id do usuário no MongoDB)
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) { res.status(200).json(user); } else { res.status(404).json({ message: 'User not found' }); }
    } catch (error) {
        console.error("Error in getUserById controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to get user by ID', error: error.message });
    }
};

// @desc    Atualizar um usuário (apenas para Admin pode atualizar OUTROS usuários)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res) => {
    const { name, email, password, phone, addresses, payment_methods, role } = req.body;
    const userId = req.params.id; // ID do usuário a ser atualizado (o _id do Mongo)

    try {
        const user = await User.findById(userId);
        if (user) {
            user.name = name !== undefined ? name : user.name;
            user.email = email !== undefined ? email : user.email;
            user.phone = phone !== undefined ? phone : user.phone;
            user.addresses = addresses !== undefined ? addresses : user.addresses;
            user.payment_methods = payment_methods !== undefined ? payment_methods : user.payment_methods;
            user.role = role !== undefined ? role : user.role; // Admin pode mudar o papel!
            if (password && password.length > 0) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
                phone: updatedUser.phone, addresses: updatedUser.addresses, payment_methods: updatedUser.payment_methods,
                role: updatedUser.role,
            });
        } else { res.status(404).json({ message: 'User not found' }); }
    } catch (error) {
        console.error("Error in updateUserByAdmin controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to update user by admin', error: error.message });
    }
};

// @desc    Deletar um usuário (apenas para Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (user) { res.json({ message: 'User removed' }); } else { res.status(404).json({ message: 'User not found' }); }
    } catch (error) {
        console.error("Error in deleteUser controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to delete user', error: error.message });
    }
};

module.exports = {
    getAllUsers, getUserById, updateUserByAdmin, deleteUser,
};