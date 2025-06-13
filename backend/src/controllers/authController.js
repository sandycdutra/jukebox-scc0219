// backend/src/controllers/authController.js
const User = require('../models/User'); // Importa o modelo de usuário
const jwt = require('jsonwebtoken'); // Para gerar JWTs

// Função auxiliar para gerar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expira em 1 dia
    });
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone, cep } = req.body;

    try {
        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Cria o novo usuário
        const user = await User.create({
            name,
            email,
            password,
            phone,
            cep,
            favorite_products: [], // Inicializa como array vazio
            role: 'customer' // Padrão
        });

        // Se o usuário foi criado, retorna os dados do usuário e um token JWT
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cep: user.cep,
                favorite_products: user.favorite_products,
                role: user.role,
                token: generateToken(user._id), // Gera e retorna um token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to register user' });
    }
};

// @desc    Autenticar usuário & obter token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Encontra o usuário pelo email
        const user = await User.findOne({ email });

        // Verifica se o usuário existe e se a senha está correta
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cep: user.cep,
                favorite_products: user.favorite_products,
                role: user.role,
                token: generateToken(user._id), // Gera e retorna um token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' }); // 401 Unauthorized
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to login user' });
    }
};

module.exports = { registerUser, loginUser };