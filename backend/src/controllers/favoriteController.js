// backend/src/controllers/favoriteController.js
const User = require('../models/User');
const Product = require('../models/Product'); // Importa o modelo de Produto para buscar os detalhes

// @desc    Obter favoritos do usuário logado
// @route   GET /api/users/me/favorites
// @access  Private (requer token)
const getUserFavorites = async (req, res) => {
    // req.user é populado pelo middleware 'protect' com o objeto do usuário logado
    try {
        const user = await User.findById(req.user._id).select('favorite_products'); // Busca o usuário e seleciona apenas os favoritos
        if (user) {
            const favoriteProductIds = user.favorite_products; // Obtém os IDs dos produtos favoritos
            
            // <--- CORREÇÃO CRÍTICA AQUI: Buscar os detalhes completos dos produtos usando os IDs
            // Product.find({ id: { $in: favoriteProductIds } }) encontra todos os produtos cujos IDs estão na lista.
            const favoritesWithDetails = await Product.find({ id: { $in: favoriteProductIds } });
            
            res.json(favoritesWithDetails); // Retorna o ARRAY de objetos de produto COMPLETOS
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to get user favorites' });
    }
};

// @desc    Adicionar produto aos favoritos do usuário logado
// @route   POST /api/users/favorites
// @access  Private (requer token)
const addFavoriteProduct = async (req, res) => {
    const { productId } = req.body; // Espera o ID do produto no corpo da requisição

    try {
        const user = await User.findById(req.user._id); // Encontra o usuário logado
        const productExists = await Product.findOne({ id: productId }); // Verifica se o produto existe pelo ID

        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (user) {
            // Verifica se o produto já está nos favoritos
            // Convertendo para String para garantir comparação correta (IDs podem ser números ou strings)
            if (user.favorite_products.some(favId => String(favId) === String(productId))) {
                return res.status(400).json({ message: 'Product already in favorites' });
            }
            user.favorite_products.push(productId); // Adiciona o ID do produto
            await user.save(); // Salva o usuário atualizado
            res.status(200).json({ message: 'Product added to favorites', favorites: user.favorite_products });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to add product to favorites' });
    }
};

// @desc    Remover produto dos favoritos do usuário logado
// @route   DELETE /api/users/favorites/:productId
// @access  Private (requer token)
const removeFavoriteProduct = async (req, res) => {
    const { productId } = req.params; // Obtém o ID do produto da URL

    try {
        const user = await User.findById(req.user._id); // Encontra o usuário logado

        if (user) {
            // Filtra o array de favoritos para remover o produto
            const initialLength = user.favorite_products.length;
            // Garante que a comparação seja feita com strings para IDs
            user.favorite_products = user.favorite_products.filter(favId => String(favId) !== String(productId));

            if (user.favorite_products.length === initialLength) {
                return res.status(404).json({ message: 'Product not found in favorites' });
            }

            await user.save(); // Salva o usuário atualizado
            res.status(200).json({ message: 'Product removed from favorites', favorites: user.favorite_products });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to remove product from favorites' });
    }
};

module.exports = { getUserFavorites, addFavoriteProduct, removeFavoriteProduct };