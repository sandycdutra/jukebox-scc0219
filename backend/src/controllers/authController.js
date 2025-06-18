// backend/src/controllers/authController.js
const User = require('../models/User'); // Importa o modelo de usuário
const jwt = require('jsonwebtoken');     // Para gerar JWTs (JSON Web Tokens)
const bcrypt = require('bcryptjs');      // Para fazer hash e comparar senhas
const { v4: uuidv4 } = require('uuid');  // Para gerar IDs únicos (UUIDs) para endereços


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
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const addresses = [];
        if (street && city && state && zip_code) {
            addresses.push({
                id: uuidv4(),
                street: street,
                city: city,
                state: state,
                zip_code: zip_code,
                phone: phone || '',
                isDefault: true
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            addresses,
            payment_methods: [], // Inicializa como array vazio
            favorite_products: [],
            role: 'customer'
        });

        if (user) {
            res.status(201).json({
                _id: user._id, name: user.name, email: user.email,
                phone: user.phone,
                addresses: user.addresses || [],
                payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products, role: user.role, token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Error in registerUser controller:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server Error: Failed to register user' });
        }
    }
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
                _id: user._id, name: user.name, email: user.email,
                phone: user.phone,
                addresses: user.addresses || [],
                payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products, role: user.role, token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error in loginUser controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to login user' });
    }
};

// @desc    Obter o perfil do usuário logado (usado para MyAccount e EditProfile)
// @route   GET /api/auth/profile
// @access  Private (requer token JWT válido)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                _id: user._id, name: user.name, email: user.email,
                phone: user.phone || '',
                addresses: user.addresses || [],
                payment_methods: user.payment_methods || [],
                favorite_products: user.favorite_products, role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getUserProfile controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to get user profile' });
    }
};

// @desc    Atualizar o perfil do usuário logado
// @route   PUT /api/auth/profile
// @access  Private (requer token JWT válido)
const updateUserProfile = async (req, res) => {
    const { name, email, password, phone, addresses, payment_methods } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name !== undefined ? name : user.name;
            user.email = email !== undefined ? email : user.email;
            user.phone = phone !== undefined ? phone : user.phone; // Atualiza telefone direto

            if (addresses !== undefined) {
                user.addresses = addresses;
            } else {
                user.addresses = user.addresses || [];
            }
            if (payment_methods !== undefined) {
                user.payment_methods = payment_methods;
            } else {
                user.payment_methods = user.payment_methods || [];
            }

            if (password && password.length > 0) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
                phone: updatedUser.phone,
                addresses: updatedUser.addresses,
                payment_methods: updatedUser.payment_methods,
                favorite_products: updatedUser.favorite_products, role: updatedUser.role,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in updateUserProfile controller:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server Error: Failed to update user profile' });
        }
    }
};

// @desc    Adicionar um novo método de pagamento ao usuário logado
// @route   POST /api/auth/payment-methods
// @access  Private (requer token)
const addPaymentMethod = async (req, res) => {
    // Campos do novo método de pagamento
    const { cardType, cardNumberLast4, cardName, cardExpiry, isDefault = false } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newMethod = {
            id: uuidv4(), // Gera um ID único para o método de pagamento
            cardType,
            cardNumberLast4,
            cardName,
            cardExpiry,
            isDefault
        };

        user.payment_methods.push(newMethod); // Adiciona o novo método ao array
        await user.save(); // Salva o usuário atualizado

        res.status(201).json({ message: 'Payment method added', paymentMethod: newMethod, userPaymentMethods: user.payment_methods });
    } catch (error) {
        console.error("Error adding payment method:", error);
        res.status(500).json({ message: 'Server Error: Failed to add payment method' });
    }
};

// @desc    Deletar um método de pagamento do usuário logado
// @route   DELETE /api/auth/payment-methods/:methodId
// @access  Private (requer token)
const deletePaymentMethod = async (req, res) => {
    const { methodId } = req.params;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const initialLength = user.payment_methods.length;
        user.payment_methods = user.payment_methods.filter(method => String(method.id) !== String(methodId));

        if (user.payment_methods.length === initialLength) {
            return res.status(404).json({ message: 'Payment method not found in user profile' });
        }

        await user.save();
        res.status(200).json({ message: 'Payment method deleted', userPaymentMethods: user.payment_methods });
    } catch (error) {
        console.error("Error deleting payment method:", error);
        res.status(500).json({ message: 'Server Error: Failed to delete payment method' });
    }
};


module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, addPaymentMethod, deletePaymentMethod };