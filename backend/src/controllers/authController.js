// backend/src/controllers/authController.js
// Este controlador lida com autenticação (registro, login)
// e com o perfil e dados (endereços, pagamentos, favoritos) do PRÓPRIO usuário logado.
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs para endereços/pagamentos
const Product = require('../models/Product'); // Para favoritos

// Função auxiliar para gerar um token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone, street, city, state, zip_code } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) { return res.status(400).json({ message: 'User with this email already exists' }); }
        const addresses = [];
        if (street && city && state && zip_code) {
            addresses.push({ id: uuidv4(), street, city, state, zip_code, phone: phone || '', isDefault: true });
        }
        const role = email.endsWith('@jukebox.com') ? 'admin' : 'customer';
        const user = await User.create({ name, email, password, phone, addresses, payment_methods: [], favorite_products: [], role });
        if (user) {
            res.status(201).json({
                _id: user._id, name: user.name, email: user.email, phone: user.phone,
                addresses: user.addresses || [], payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products, role: user.role, token: generateToken(user._id),
            });
        } else { res.status(400).json({ message: 'Invalid user data' }); }
    } catch (error) { console.error("Error in registerUser controller:", error); if (error.name === 'ValidationError') { res.status(400).json({ message: error.message }); } else { res.status(500).json({ message: 'Server Error: Failed to register user' }); } }
};

// @desc    Autenticar usuário e obter token JWT
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id, name: user.name, email: user.email, phone: user.phone,
                addresses: user.addresses || [], payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products, role: user.role, token: generateToken(user._id),
            });
        } else { res.status(401).json({ message: 'Invalid email or password' }); }
    } catch (error) { console.error("Error in loginUser controller:", error); res.status(500).json({ message: 'Server Error: Failed to login user' }); }
};

// @desc    Obter o perfil do usuário logado
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // <--- CORRIGIDO AQUI: Usar req.user._id consistentemente ---
        const user = await User.findById(req.user._id).select('-password'); 
        if (user) {
            res.json({
                _id: user._id, name: user.name, email: user.email, phone: user.phone || '',
                addresses: user.addresses || [], payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products, role: user.role,
            });
        } else { res.status(404).json({ message: 'User not found' }); }
    } catch (error) { console.error("Error in getUserProfile controller:", error); res.status(500).json({ message: 'Server Error: Failed to get user profile' }); }
};

// @desc    Atualizar o perfil do usuário logado (nome, email, telefone, endereços, métodos de pagamento)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const { name, email, password, phone, addresses, payment_methods } = req.body;
    try {
        // <--- CORRIGIDO AQUI: Usar req.user._id consistentemente ---
        const user = await User.findById(req.user._id); 
        if (user) {
            user.name = name !== undefined ? name : user.name;
            user.email = email !== undefined ? email : user.email;
            user.phone = phone !== undefined ? phone : user.phone;
            if (addresses !== undefined) { user.addresses = addresses; } else { user.addresses = user.addresses || []; }
            if (payment_methods !== undefined) { user.payment_methods = payment_methods; } else { user.payment_methods = user.payment_methods || []; }
            if (password && password.length > 0) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
                phone: updatedUser.phone, addresses: updatedUser.addresses, payment_methods: updatedUser.payment_methods,
                favorite_products: updatedUser.favorite_products, role: updatedUser.role, token: generateToken(updatedUser._id),
            });
        } else { res.status(404).json({ message: 'User not found' }); }
    } catch (error) { console.error("Error in updateUserProfile controller:", error); if (error.name === 'ValidationError') { res.status(400).json({ message: error.message }); } else { res.status(500).json({ message: 'Server Error: Failed to update user profile' }); } }
};

// @desc    Adicionar um novo método de pagamento ao usuário logado
// @route   POST /api/auth/payment-methods
// @access  Private
const addPaymentMethod = async (req, res) => {
    const { cardType, cardNumberLast4, cardName, cardExpiry, isDefault = false } = req.body;
    try {
        // <--- CORRIGIDO AQUI: Usar req.user._id consistentemente ---
        const user = await User.findById(req.user._id); 
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        const newMethod = { id: uuidv4(), cardType, cardNumberLast4, cardName, cardExpiry, isDefault };
        user.payment_methods.push(newMethod);
        await user.save();
        res.status(201).json({ message: 'Payment method added', paymentMethod: newMethod, userPaymentMethods: user.payment_methods });
    } catch (error) { console.error("Error adding payment method:", error); res.status(500).json({ message: 'Server Error: Failed to add payment method' }); }
};

// @desc    Deletar um método de pagamento do usuário logado
// @route   DELETE /api/auth/payment-methods/:methodId
// @access  Private
const deletePaymentMethod = async (req, res) => {
    const { methodId } = req.params;
    try {
        // <--- CORRIGIDO AQUI: Usar req.user._id consistentemente ---
        const user = await User.findById(req.user._id); 
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        const initialLength = user.payment_methods.length;
        user.payment_methods = user.payment_methods.filter(method => String(method.id) !== String(methodId));
        if (user.payment_methods.length === initialLength) { return res.status(404).json({ message: 'Payment method not found in user profile' }); }
        await user.save();
        res.status(200).json({ message: 'Payment method deleted', userPaymentMethods: user.payment_methods });
    } catch (error) { console.error("Error deleting payment method:", error); res.status(500).json({ message: 'Server Error: Failed to delete payment method' }); }
};

// --- Funções de Gerenciamento de Favoritos (Para o PRÓPRIO Usuário) ---

// @desc    Obter favoritos do usuário logado
// @route   GET /api/auth/me/favorites
// @access  Private
const getUserFavorites = async (req, res) => {
    try {
        // <--- CORRIGIDO AQUI: Usar req.user._id consistentemente ---
        const user = await User.findById(req.user._id).select('favorite_products'); 
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        const favoriteProductIds = user.favorite_products;
        const favoritesWithDetails = await Product.find({ id: { $in: favoriteProductIds } });
        res.status(200).json({
            success: true, message: 'User favorites fetched successfully!', favorites: favoritesWithDetails,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone || '',
                addresses: user.addresses || [], payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products || [], role: user.role,
            }
        });
    } catch (error) { console.error('Error in getUserFavorites:', error); res.status(500).json({ message: 'Server Error: Failed to get user favorites' }); }
};

// @desc    Adicionar produto aos favoritos do usuário logado
// @route   POST /api/auth/favorites
// @access  Private
const addFavoriteProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        // <--- CORRIGIDO AQUI: Usar req.user._id consistentemente ---
        const user = await User.findById(req.user._id); 
        const productExists = await Product.findOne({ id: productId });
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        if (!productExists) { return res.status(404).json({ message: 'Product not found' }); }
        if (user.favorite_products.some(favId => String(favId) === String(productId))) { return res.status(400).json({ message: 'Product already in favorites' }); }
        user.favorite_products.push(productId);
        await user.save();
        res.status(200).json({
            success: true, message: 'Product added to favorites', favorites: user.favorite_products,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone || '',
                addresses: user.addresses || [], payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products || [], role: user.role,
            }
        });
    } catch (error) { console.error('Error in addFavoriteProduct:', error); res.status(500).json({ message: 'Server Error: Failed to add product to favorites' }); }
};

// @desc    Remover produto dos favoritos do usuário logado
// @route   DELETE /api/auth/favorites/:productId
// @access  Private
const removeFavoriteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        // <--- CORRIGIDO AQUI: Usar req.user._id consistentemente ---
        const user = await User.findById(req.user._id); 
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        const initialLength = user.favorite_products.length;
        user.favorite_products = user.favorite_products.filter(favId => String(favId) !== String(productId));
        if (user.favorite_products.length === initialLength) { return res.status(404).json({ message: 'Product not found in favorites' }); }
        await user.save();
        res.status(200).json({
            success: true, message: 'Product removed from favorites', favorites: user.favorite_products,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone || '',
                addresses: user.addresses || [], payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products || [], role: user.role,
            }
        });
    } catch (error) { console.error('Error in removeFavoriteProduct:', error); res.status(500).json({ message: 'Server Error: Failed to remove product from favorites' }); }
};

module.exports = {
    registerUser, loginUser, getUserProfile, updateUserProfile, addPaymentMethod, deletePaymentMethod,
    getUserFavorites, addFavoriteProduct, removeFavoriteProduct,
};