// backend/src/controllers/orderController.js
const Order = require('../models/Order'); // Importa o modelo de Pedido
const Product = require('../models/Product'); // Importa o modelo de Produto para atualização de estoque
const User = require('../models/User'); // Importa o modelo de Usuário para associar pedidos


// @desc    Criar um novo pedido
// @route   POST /api/orders
// @access  Private (requer token do usuário logado)
const createOrder = async (req, res) => {
    // req.user._id vem do middleware 'protect'
    const { items, shipping_address, payment_method, total_amount } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    try {
        const order = new Order({
            user: req.user._id, // Associa o pedido ao usuário logado
            items,
            shipping_address,
            payment_method,
            total_amount,
            payment_status: 'completed', // Na simulação, o pagamento é sempre concluído aqui
        });

        const createdOrder = await order.save();

        // Opcional: Atualizar sold_quantity e stock_quantity dos produtos no DB
        // Essa lógica já está no PUT /api/products/:id que o frontend faz no checkout.
        // Se a API /api/orders fosse responsável por tudo, você faria essa atualização aqui.
        // Como o frontend já atualiza o estoque individualmente, podemos remover isso daqui
        // ou ter uma transação para garantir que ambas as operações sejam atômicas.
        // Por simplicidade, vamos confiar que o frontend já fez o PUT para cada produto.

        res.status(201).json(createdOrder); // 201 Created
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to create order' });
    }
};

// @desc    Obter todos os pedidos do usuário logado
// @route   GET /api/orders/myorders
// @access  Private (requer token)
const getMyOrders = async (req, res) => {
    // req.user._id vem do middleware 'protect'
    try {
        // Encontra todos os pedidos associados ao usuário logado, ordenados do mais novo para o mais antigo
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to get user orders' });
    }
};

// @desc    Obter um pedido específico pelo ID (do usuário logado)
// @route   GET /api/orders/:id
// @access  Private (requer token)
const getOrderById = async (req, res) => {
    try {
        // Encontra o pedido pelo ID e verifica se ele pertence ao usuário logado
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found or does not belong to user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to get order by ID' });
    }
};


module.exports = { createOrder, getMyOrders, getOrderById };