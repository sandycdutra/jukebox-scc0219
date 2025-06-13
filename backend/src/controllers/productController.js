// backend/src/controllers/productController.js
const Product = require('../models/Product'); // <--- Caminho corrigido e padrão

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to get products' });
    }
};

// @desc    Obter um único produto pelo ID (usando o 'id' que você tem no frontend)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id }); // Busca pelo campo 'id'
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to get product by ID' });
    }
};

// @desc    Criar um novo produto (para o seed inicial)
// @route   POST /api/products
// @access  Admin (futuramente)
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body); // Cria um novo produto com os dados do corpo da requisição
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to create product' });
    }
};

// @desc    Atualizar um produto (para o checkout diminuir o estoque)
// @route   PUT /api/products/:id
// @access  Admin (futuramente, por enquanto aberto para teste)
const updateProduct = async (req, res) => {
    const { stock_quantity, sold_quantity } = req.body;

    try {
        // Busca o produto pelo 'id' que vem da URL
        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            if (stock_quantity !== undefined) product.stock_quantity = stock_quantity;
            if (sold_quantity !== undefined) product.sold_quantity = sold_quantity;
            // Adicione outras propriedades que você possa querer atualizar (e.g., name, price)

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to update product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
};