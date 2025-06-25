// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');       // Rotas de perfil DO PRÓPRIO usuário (auth)
const orderRoutes = require('./src/routes/orderRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const userRoutes = require('./src/routes/userRoutes'); // Rotas de ADMIN para OUTROS usuários

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); // Mantenha isso se precisar para forms HTML tradicionais, senão pode remover

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Backend API!' });
});

// --- ROTAS DE USUÁRIO COMUM (AUTENTICAÇÃO, PERFIL, FAVORITOS, MÉTODOS DE PAGAMENTO) ---
// Todas essas rotas estão no authRoutes.js e começam com /api/auth
app.use('/api/auth', authRoutes); 

// --- ROTAS DE PRODUTOS ---
app.use('/api/products', productRoutes);

// --- ROTAS DE PEDIDOS ---
app.use('/api/orders', orderRoutes);

// --- ROTAS DE CARRINHO ---
app.use('/api/cart', cartRoutes); 

// --- ROTAS DE ADMIN PARA GERENCIAR USUÁRIOS (APENAS AQUI) ---
// As rotas dentro de userRoutes.js SÓ devem ser acessíveis via /api/admin/users
app.use('/api/admin/users', userRoutes); // <--- APENAS UMA VEZ E NO PREFIXO CORRETO

// --- Middleware para 404 (Rota não encontrada) ---
app.use((req, res) => {
    console.warn(`[SERVER] 404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'API Endpoint Not Found' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});