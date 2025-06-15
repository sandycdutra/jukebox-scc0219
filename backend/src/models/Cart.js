// backend/src/models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    id: { type: String, required: true }, // ID único do produto
    name: { type: String, required: true }, // Nome do produto
    image: { type: String }, // URL da imagem principal (images[0])
    price: { type: Number, required: true }, // Preço unitário
    type: { type: String }, // Ex: 'vinyl', 'cd', 'accessory'
    metadata: { // Objeto para armazenar artista, gênero, etc.
        artist: { type: String },
        genre: { type: String },
        subgenre: { type: String }
    },
    // <--- NOVOS CAMPOS ESSENCIAIS PARA O CARRINHO E VALIDAÇÃO DE ESTOQUE
    stock_quantity: { type: Number, required: true }, // Estoque atual do produto (no momento da adição)
    sold_quantity: { type: Number, default: 0 },    // Quantidade vendida (no momento da adição)
    
    quantity: { type: Number, required: true, default: 1 } // Quantidade no carrinho
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);