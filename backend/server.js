// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const cartRoutes = require('./src/routes/cartRoutes'); 
const userRoutes = require('./src/routes/userRoutes'); 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Backend API!' });
});

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); // rotas de usuário (perfil, endereços, pagamentos , favoritos)
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});