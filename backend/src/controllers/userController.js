// backend/src/controllers/userController.js
const User = require('../models/User'); 
const Product = require('../models/Product'); 
const mongoose = require('mongoose'); 

// --- Funções de Gerenciamento de Perfil ---

// @desc    Get user profile data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // CORREÇÃO AQUI: Retorne o user completo sob a chave 'user'
        res.status(200).json({
            success: true, // Adicionado para consistência
            message: 'User profile fetched successfully!', // Adicionado para consistência
            user: { 
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses || [], 
                payment_methods: user.payment_methods || [],
                phone: user.phone || '', 
                favorite_products: user.favorite_products || [], 
                role: user.role, 
            }
        });
    } catch (error) {
        console.error('Error in getMe:', error);
        res.status(500).json({ message: 'Server Error: Failed to get user profile' });
    }
};

// @desc    Update user profile data
// @route   PUT /api/users/profile
// @access  Private (requires token)
const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email, phone } = req.body; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully!',
            user: { 
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses || [],
                payment_methods: user.payment_methods || [],
                phone: user.phone || '',
                favorite_products: user.favorite_products || [],
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, message: 'Server error updating user profile' });
    }
};

// @desc    Add a new address to user profile (or update existing)
// @route   PUT /api/users/profile/address
// @access  Private (requires token)
const addAddressToProfile = async (req, res) => {
    // New: Check for 'id' to determine if it's an update or new add
    const { id, street, city, state, zip_code, phone, isDefault } = req.body; 
    const userId = req.user.id; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let updatedAddress;
        let message;
        if (id) {
            // Attempt to find and update an existing address
            const addressIndex = user.addresses.findIndex(addr => String(addr.id) === String(id));
            if (addressIndex > -1) {
                // Update existing address fields
                user.addresses[addressIndex].street = street !== undefined ? street : user.addresses[addressIndex].street;
                user.addresses[addressIndex].city = city !== undefined ? city : user.addresses[addressIndex].city;
                user.addresses[addressIndex].state = state !== undefined ? state : user.addresses[addressIndex].state;
                user.addresses[addressIndex].zip_code = zip_code !== undefined ? zip_code : user.addresses[addressIndex].zip_code;
                user.addresses[addressIndex].phone = phone !== undefined ? phone : user.addresses[addressIndex].phone;
                
                if (isDefault !== undefined) {
                    user.addresses.forEach(addr => addr.isDefault = false); // Clear other defaults
                    user.addresses[addressIndex].isDefault = isDefault;
                }
                updatedAddress = user.addresses[addressIndex];
                message = 'Address updated successfully!';
            } else {
                return res.status(404).json({ success: false, message: 'Address to update not found.' });
            }
        } else {
            // Add new address (original logic)
            const newAddressId = new mongoose.Types.ObjectId().toString(); 
            const newAddress = {
                id: newAddressId, 
                street,
                city,
                state,
                zip_code,
                phone: phone || '',
                isDefault: user.addresses.length === 0 ? true : (isDefault || false) // First address is default, or use provided isDefault
            };
            user.addresses.push(newAddress); 
            updatedAddress = newAddress;
            message = 'Address added successfully!';
        }

        await user.save(); 

        res.status(200).json({
            success: true,
            message: message,
            address: updatedAddress, 
            user: { 
                _id: user._id, 
                name: user.name,
                email: user.email,
                addresses: user.addresses, // Retorna o array de endereços ATUALIZADO
                payment_methods: user.payment_methods,
                phone: user.phone || '',
                favorite_products: user.favorite_products || [],
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Error adding/updating address:', error);
        res.status(500).json({ success: false, message: 'Server error adding/updating address' });
    }
};

// @desc    Delete an address from user profile
// @route   DELETE /api/users/profile/address/:addressId
// @access  Private (requires token)
const deleteAddressFromProfile = async (req, res) => {
    const { addressId } = req.params; 
    const userId = req.user.id; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const initialAddressCount = user.addresses.length;
        user.addresses = user.addresses.filter(addr => String(addr.id) !== String(addressId)); 

        if (user.addresses.length === initialAddressCount) {
            return res.status(404).json({ success: false, message: 'Address not found or already deleted' });
        }

        await user.save(); 

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully!',
            user: { 
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses,
                payment_methods: user.payment_methods,
                phone: user.phone || '',
                favorite_products: user.favorite_products || [],
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ success: false, message: 'Server error deleting address' });
    }
};

// @desc    Add a new payment method to user profile
// @route   PUT /api/users/profile/payment
// @access  Private (requires token)
const addPaymentMethodToProfile = async (req, res) => {
    const { cardType, cardNumberLast4, cardName, cardExpiry } = req.body; 
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const newPaymentMethodId = new mongoose.Types.ObjectId().toString(); 

        const newPaymentMethod = {
            id: newPaymentMethodId, 
            cardType,
            cardNumberLast4,
            cardName,
            cardExpiry,
        };

        user.payment_methods.push(newPaymentMethod);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Payment method added successfully!',
            paymentMethod: newPaymentMethod, 
            user: { 
                _id: user._id, 
                name: user.name,
                email: user.email,
                addresses: user.addresses,
                payment_methods: user.payment_methods,
                phone: user.phone || '',
                favorite_products: user.favorite_products || [],
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Error adding payment method:', error);
        res.status(500).json({ success: false, message: 'Server error adding payment method' });
    }
};

// @desc    Delete a payment method from user profile
// @route   DELETE /api/users/profile/payment/:paymentId
// @access  Private (requires token)
const deletePaymentMethodFromProfile = async (req, res) => {
    const { paymentId } = req.params; 
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const initialPaymentCount = user.payment_methods.length;
        user.payment_methods = user.payment_methods.filter(method => String(method.id) !== String(paymentId)); 

        if (user.payment_methods.length === initialPaymentCount) {
            return res.status(404).json({ success: false, message: 'Payment method not found or already deleted' });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Payment method deleted successfully!',
            user: { 
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses,
                payment_methods: user.payment_methods,
                phone: user.phone || '',
                favorite_products: user.favorite_products || [],
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Error deleting payment method:', error);
        res.status(500).json({ success: false, message: 'Server error deleting payment method' });
    }
};

// --- Funções de Gerenciamento de Favoritos ---

// @desc    Obter favoritos do usuário logado
// @route   GET /api/users/me/favorites (rota lógica)
// @access  Private (requer token)
const getUserFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('favorite_products'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const favoriteProductIds = user.favorite_products; 
        const favoritesWithDetails = await Product.find({ id: { $in: favoriteProductIds } });
        
        // CORREÇÃO AQUI: Retorne o user completo sob a chave 'user', e os favoritos como um array separado ou dentro do user
        res.status(200).json({
            success: true,
            message: 'User favorites fetched successfully!',
            favorites: favoritesWithDetails, // Array de produtos favoritos completos
            user: { // Retorne o user COMPLETO para consistência
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses || [],
                payment_methods: user.payment_methods || [],
                phone: user.phone || '',
                favorite_products: user.favorite_products || [], // Retorne os IDs dos favoritos
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Error in getUserFavorites:', error); 
        res.status(500).json({ message: 'Server Error: Failed to get user favorites' });
    }
};

// @desc    Adicionar produto aos favoritos do usuário logado
// @route   POST /api/users/favorites (rota lógica)
// @access  Private (requer token)
const addFavoriteProduct = async (req, res) => {
    const { productId } = req.body; 

    try {
        const user = await User.findById(req.user.id); 
        const productExists = await Product.findOne({ id: productId }); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (user.favorite_products.some(favId => String(favId) === String(productId))) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }
        user.favorite_products.push(productId); 
        await user.save(); 

        // CORREÇÃO AQUI: Retorne o user completo sob a chave 'user'
        res.status(200).json({ 
            success: true, // Adicionado para consistência
            message: 'Product added to favorites', 
            favorites: user.favorite_products, // Ainda retorna o array de IDs favoritos para compatibilidade com frontend
            user: { // Retorne o user COMPLETO para consistência
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses || [],
                payment_methods: user.payment_methods || [],
                phone: user.phone || '',
                favorite_products: user.favorite_products || [],
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Error in addFavoriteProduct:', error); 
        res.status(500).json({ message: 'Server Error: Failed to add product to favorites' });
    }
};

// @desc    Remover produto dos favoritos do usuário logado
// @route   DELETE /api/users/favorites/:productId (rota lógica)
// @access  Private (requer token)
const removeFavoriteProduct = async (req, res) => {
    const { productId } = req.params; 

    try {
        const user = await User.findById(req.user.id); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const initialLength = user.favorite_products.length;
        user.favorite_products = user.favorite_products.filter(favId => String(favId) !== String(productId));

        if (user.favorite_products.length === initialLength) {
            return res.status(404).json({ message: 'Product not found in favorites' });
        }

        await user.save(); 
        
        // CORREÇÃO AQUI: Retorne o user completo sob a chave 'user'
        res.status(200).json({ 
            success: true, // Adicionado para consistência
            message: 'Product removed from favorites', 
            favorites: user.favorite_products, // Ainda retorna o array de IDs favoritos
            user: { // Retorne o user COMPLETO para consistência
                _id: user._id,
                name: user.name,
                email: user.email,
                addresses: user.addresses || [],
                payment_methods: user.payment_methods || [],
                phone: user.phone || '',
                favorite_products: user.favorite_products || [],
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Error in removeFavoriteProduct:', error); 
        res.status(500).json({ message: 'Server Error: Failed to remove product from favorites' });
    }
};

module.exports = {
    getMe,
    updateUserProfile,
    addAddressToProfile,
    deleteAddressFromProfile,
    addPaymentMethodToProfile,
    deletePaymentMethodFromProfile,
    getUserFavorites,
    addFavoriteProduct,
    removeFavoriteProduct,
};