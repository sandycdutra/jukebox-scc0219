// backend/src/controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Obter o carrinho do usuário logado
// @route   GET /api/cart
// @access  Private (requer token)
const getUserCart = async (req, res) => { // <--- DEFINIÇÃO DA FUNÇÃO getUserCart
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            res.json(cart);
        } else {
            const newCart = await Cart.create({ user: req.user._id, items: [] });
            res.status(200).json(newCart);
        }
    } catch (error) {
        console.error("Error in getUserCart controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to get user cart' });
    }
};

// @desc    Adicionar/Atualizar um item no carrinho do usuário logado
// @route   POST /api/cart/add
// @access  Private (requer token)
const addToCart = async (req, res) => { // <--- DEFINIÇÃO DA FUNÇÃO addToCart
    const { product: productData, quantity } = req.body; 

    if (!productData || !productData.id || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => String(item.id) === String(productData.id));

        const dbProduct = await Product.findOne({ id: productData.id });
        if (!dbProduct) {
            return res.status(404).json({ message: 'Product not found in database' });
        }
        if (dbProduct.stock_quantity === 0) {
            return res.status(400).json({ message: `Product "${dbProduct.name}" is out of stock` });
        }

        const currentCartQuantity = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
        const requestedTotalQuantity = currentCartQuantity + quantity;

        if (requestedTotalQuantity > dbProduct.stock_quantity) {
            return res.status(400).json({ message: `Not enough stock for "${dbProduct.name}". Available: ${dbProduct.stock_quantity - currentCartQuantity}` });
        }

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity = requestedTotalQuantity;
            cart.items[existingItemIndex].name = productData.name;
            cart.items[existingItemIndex].image = productData.images && productData.images.length > 0 ? productData.images[0] : '';
            cart.items[existingItemIndex].price = productData.price;
            cart.items[existingItemIndex].type = productData.type;
            cart.items[existingItemIndex].metadata = productData.metadata;
            cart.items[existingItemIndex].stock_quantity = productData.stock_quantity;
            cart.items[existingItemIndex].sold_quantity = productData.sold_quantity;

        } else {
            cart.items.push({
                id: productData.id,
                name: productData.name,
                image: productData.images && productData.images.length > 0 ? productData.images[0] : '',
                price: productData.price,
                type: productData.type,
                metadata: productData.metadata,
                quantity: quantity,
                stock_quantity: productData.stock_quantity,
                sold_quantity: productData.sold_quantity
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error in addToCart controller:", error);
        res.status(500).json({ message: 'Server Error: Failed to add item to cart' });
    }
};

// @desc    Remover um item do carrinho do usuário logado
// @route   DELETE /api/cart/remove/:productId
// @access  Private (requer token)
const removeFromCart = async (req, res) => { // <--- DEFINIÇÃO DA FUNÇÃO removeFromCart
    const { productId } = req.params;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => String(item.id) !== String(productId));

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: 'Server Error: Failed to remove item from cart' });
    }
};

// @desc    Atualizar a quantidade de um item específico no carrinho do usuário logado
// @route   PUT /api/cart/update-quantity
// @access  Private (requer token)
const updateCartItemQuantity = async (req, res) => { // <--- DEFINIÇÃO DA FUNÇÃO updateCartItemQuantity
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => String(item.id) === String(productId));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const dbProduct = await Product.findOne({ id: productId });
        if (!dbProduct) {
            return res.status(404).json({ message: 'Product not found in database' });
        }

        if (quantity > dbProduct.stock_quantity) {
            return res.status(400).json({ message: `Not enough stock for "${dbProduct.name}". Available: ${dbProduct.stock_quantity}` });
        }
        
        if (quantity <= 0) {
             cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].stock_quantity = dbProduct.stock_quantity; 
            cart.items[itemIndex].sold_quantity = dbProduct.sold_quantity; 
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ message: 'Server Error: Failed to update cart item quantity' });
    }
};

// @desc    Limpar o carrinho do usuário logado
// @route   DELETE /api/cart/clear
// @access  Private (requer token)
const clearUserCart = async (req, res) => { // <--- DEFINIÇÃO DA FUNÇÃO clearUserCart
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
            res.status(200).json({ message: 'Cart cleared successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found for this user' });
        }
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: 'Server Error: Failed to clear cart' });
    }
};

// <--- EXPORTAÇÃO DE TODAS AS FUNÇÕES DEFINIDAS ACIMA
module.exports = { getUserCart, addToCart, removeFromCart, updateCartItemQuantity, clearUserCart };