// backend/src/controllers/productController.js
const Product = require('../models/Product');

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error in getProducts controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to get products', error: error.message });
    }
};

// @desc    Obter um único produto pelo ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error in getProductById controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to get product', error: error.message });
    }
};

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Admin (precisa do middleware 'admin')
const createProduct = async (req, res) => {
    const { id, sku, name, type, price, description, stock_quantity, sold_quantity, images, artist, genre, subgenre, condition } = req.body;
    try {
        const product = new Product({
            id, sku, name, type, price, description, stock_quantity, sold_quantity, images, artist, genre,
            metadata: {
                artist: metadata?.artist || artist,
                release_year: metadata?.release_year || 2023,
                genre: metadata?.genre || genre,
                subgenre: metadata?.subgenre || subgenre,
                condition: metadata?.condition || condition || 'new'
            }
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error in createProduct controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to create product', error: error.message });
    }
};

// @desc    Atualizar um produto existente
// @route   PUT /api/products/:id (ou :id do Mongo _id)
// @access  Admin (precisa do middleware 'admin')
const updateProduct = async (req, res) => {
    const productId = req.params.id; // Este é o ID que você usa no frontend (1, 2, etc.)
    const { sku, name, type, price, description, stock_quantity, sold_quantity, images, metadata, artist, genre, subgenre, condition } = req.body;
    try {
        const product = await Product.findOne({ id: productId }); // Encontra pelo seu 'id' personalizado
        if (product) {
            product.sku = sku !== undefined ? sku : product.sku;
            product.name = name !== undefined ? name : product.name;
            product.type = type !== undefined ? type : product.type;
            product.price = price !== undefined ? price : product.price;
            product.description = description !== undefined ? description : product.description;
            product.stock_quantity = stock_quantity !== undefined ? stock_quantity : product.stock_quantity;
            product.sold_quantity = sold_quantity !== undefined ? sold_quantity : product.sold_quantity;
            product.images = images !== undefined ? images : product.images;
            product.artist = artist !== undefined ? artist : product.artist;
            product.genre = genre !== undefined ? genre : product.genre;
            if (metadata !== undefined) {
                product.metadata.artist = metadata.artist !== undefined ? metadata.artist : product.metadata.artist;
                product.metadata.release_year = metadata.release_year !== undefined ? metadata.release_year : product.metadata.release_year;
                product.metadata.genre = metadata.genre !== undefined ? metadata.genre : product.metadata.genre;
                product.metadata.subgenre = metadata.subgenre !== undefined ? metadata.subgenre : product.metadata.subgenre;
                product.metadata.condition = metadata.condition !== undefined ? metadata.condition : product.metadata.condition;
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else { res.status(404).json({ message: 'Product not found' }); }
    } catch (error) {
        console.error("Error in updateProduct controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to update product', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findOneAndDelete({ id: productId });
        if (product) { res.json({ message: 'Product removed' }); } else { res.status(404).json({ message: 'Product not found' }); }
    } catch (error) {
        console.error("Error in deleteProduct controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to delete product', error: error.message });
    }
};

module.exports = {
    getProducts, getProductById, createProduct, updateProduct, deleteProduct,
};