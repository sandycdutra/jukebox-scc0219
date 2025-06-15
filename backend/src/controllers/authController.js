// backend/src/controllers/authController.js
const User = require('../models/User'); // Importa o modelo de usuário
const jwt = require('jsonwebtoken');     // Para gerar JWTs (JSON Web Tokens)
const bcrypt = require('bcryptjs');      // Para fazer hash e comparar senhas
const { v4: uuidv4 } = require('uuid');  // Para gerar IDs únicos (UUIDs) para endereços


// Função auxiliar para gerar um token JWT
const generateToken = (id) => {
    // jwt.sign(payload, secretKey, options)
    // payload: dados a serem armazenados no token (aqui, o ID do usuário)
    // secretKey: chave secreta para assinar o token (deve ser forte e armazenada em variável de ambiente)
    // expiresIn: tempo de expiração do token (1 dia)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    // Extrai os dados do corpo da requisição
    const { name, email, password, phone, street, city, state, zip_code } = req.body;

    try {
        // Verifica se já existe um usuário com o email fornecido
        const userExists = await User.findOne({ email });
        if (userExists) {
            // Se o usuário já existe, retorna um erro 400 (Bad Request)
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Prepara o array de endereços.
        // Se dados de endereço foram fornecidos no registro inicial, cria o primeiro endereço padrão.
        const addresses = [];
        if (street && city && state && zip_code) {
            addresses.push({
                id: uuidv4(), // Gera um UUID para o ID do endereço
                street: street,
                city: city,
                state: state,
                zip_code: zip_code,
                phone: phone || '', // Usa o telefone fornecido no registro para o endereço
                isDefault: true // Marca como endereço padrão
            });
        }

        // Cria um novo usuário no banco de dados
        const user = await User.create({
            name,
            email,
            password, // A senha será hashed pelo middleware 'pre save' no modelo User
            addresses, // Salva o array de endereços
            favorite_products: [], // Inicializa como array vazio
            role: 'customer' // Define o papel padrão como 'customer'
        });

        // Se o usuário foi criado com sucesso
        if (user) {
            // Retorna os dados do usuário (sem a senha) e um token JWT
            res.status(201).json({ // 201 Created
                _id: user._id,
                name: user.name,
                email: user.email,
                // Ao retornar, mapeia os campos do User model para a resposta do cliente
                addresses: user.addresses || [], // Garante que addresses seja um array
                phone: user.addresses.length > 0 ? user.addresses[0].phone : '', // Telefone do 1º endereço, se existir
                favorite_products: user.favorite_products,
                role: user.role,
                token: generateToken(user._id), // Gera e retorna um token JWT
            });
        } else {
            // Se a criação do usuário falhar por dados inválidos
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Captura erros gerais do servidor ou de validação do Mongoose
        console.error("Error in registerUser controller:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message }); // Erro de validação do Mongoose
        } else {
            res.status(500).json({ message: 'Server Error: Failed to register user' }); // Erro interno do servidor
        }
    }
};

// @desc    Autenticar usuário e obter token JWT
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    // Extrai email e senha do corpo da requisição
    const { email, password } = req.body;

    try {
        // Encontra o usuário pelo email no banco de dados
        const user = await User.findOne({ email });

        // Verifica se o usuário existe e se a senha fornecida corresponde à senha hashed
        if (user && (await user.matchPassword(password))) {
            // Se a autenticação for bem-sucedida, retorna os dados do usuário e um token JWT
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses || [], // Retorna o array de endereços
                phone: user.addresses.length > 0 ? user.addresses[0].phone : '', // Telefone do 1º endereço
                favorite_products: user.favorite_products,
                role: user.role,
                token: generateToken(user._id), // Gera e retorna um token JWT
            });
        } else {
            // Se o usuário não for encontrado ou a senha estiver incorreta, retorna 401 Unauthorized
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        // Captura erros gerais do servidor
        console.error("Error in loginUser controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to login user' });
    }
};

// @desc    Obter o perfil do usuário logado (usado para MyAccount e EditProfile)
// @route   GET /api/auth/profile
// @access  Private (requer token JWT válido)
const getUserProfile = async (req, res) => {
    // req.user é populado pelo middleware 'protect' com o objeto do usuário logado
    try {
        // Encontra o usuário no DB pelo ID fornecido pelo token, e exclui a senha do retorno
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            // Retorna os dados do perfil do usuário
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses || [], // Garante que 'addresses' seja um array
                phone: user.addresses.length > 0 ? user.addresses[0].phone : '', // Telefone do 1º endereço
                favorite_products: user.favorite_products,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getUserProfile controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to get user profile' });
    }
};

// @desc    Atualizar perfil do usuário logado
// @route   PUT /api/auth/profile
// @access  Private (requer token)
const updateUserProfile = async (req, res) => {
    const { name, email, password, addresses, payment_methods } = req.body; // NOVO: payment_methods

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name !== undefined ? name : user.name;
            user.email = email !== undefined ? email : user.email;
            
            if (addresses !== undefined) {
                user.addresses = addresses;
            } else {
                user.addresses = user.addresses || [];
            }
            // <--- ATUALIZA ARRAY DE MÉTODOS DE PAGAMENTO
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
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                addresses: updatedUser.addresses,
                payment_methods: updatedUser.payment_methods, // Retorna os métodos de pagamento
                phone: updatedUser.addresses.length > 0 ? updatedUser.addresses[0].phone : '',
                favorite_products: updatedUser.favorite_products,
                role: updatedUser.role,
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

// --- NOVAS FUNÇÕES PARA GERENCIAR MÉTODOS DE PAGAMENTO ---
// Estas funções poderiam estar em um cartController ou userController separado,
// mas para simplificar, colocaremos aqui no authController.

// @desc    Adicionar um novo método de pagamento ao usuário logado
// @route   POST /api/auth/payment-methods
// @access  Private (requer token)
const addPaymentMethod = async (req, res) => {
    const { cardType, cardNumberLast4, cardName, cardExpiry, isDefault = false } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newMethod = {
            id: uuidv4(),
            cardType,
            cardNumberLast4,
            cardName,
            cardExpiry,
            isDefault
        };

        user.payment_methods.push(newMethod);
        await user.save();

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
            return res.status(404).json({ message: 'Payment method not found' });
        }

        await user.save();
        res.status(200).json({ message: 'Payment method deleted', userPaymentMethods: user.payment_methods });
    } catch (error) {
        console.error("Error deleting payment method:", error);
        res.status(500).json({ message: 'Server Error: Failed to delete payment method' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, addPaymentMethod, deletePaymentMethod };