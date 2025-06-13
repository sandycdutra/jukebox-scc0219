// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken'); // Importa a biblioteca para trabalhar com JWTs
const User = require('../models/User'); // Importa o modelo de Usuário para encontrar o usuário pelo ID

/**
 * Middleware de proteção de rota.
 * Verifica a presença e validade de um token JWT no cabeçalho da requisição.
 * Se válido, anexa o usuário à requ requisição (req.user).
 */
const protect = async (req, res, next) => {
    let token; // Variável para armazenar o token

    // 1. Verifica se o cabeçalho 'Authorization' existe e começa com 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtém o token (a parte depois de 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verifica a validade do token usando a chave secreta do JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Encontra o usuário no banco de dados pelo ID do token decodificado
            //    e anexa o objeto do usuário à requisição (req.user), excluindo a senha.
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Prossegue para a próxima função middleware ou controlador da rota
        } catch (error) {
            // Em caso de erro na verificação do token (expirado, inválido, etc.)
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' }); // 401 Unauthorized
        }
    }

    // Se nenhum token for encontrado no cabeçalho
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' }); // 401 Unauthorized
    }
};

/**
 * Middleware de autorização para verificar se o usuário logado é um administrador.
 * Deve ser usado APÓS o middleware 'protect'.
 */
const admin = (req, res, next) => {
    // Verifica se há um usuário na requisição (adicionado por 'protect') e se o papel é 'admin'
    if (req.user && req.user.role === 'admin') {
        next(); // Se for admin, prossegue
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
    }
};

module.exports = { protect, admin }; // Exporta ambos os middlewares