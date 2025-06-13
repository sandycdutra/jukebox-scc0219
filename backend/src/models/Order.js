// backend/src/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: { type: String, required: true }, // Referência ao ID do produto
    name: { type: String, required: true },       // Nome do produto (para histórico, caso o nome mude)
    image: { type: String },                      // Imagem do produto (para histórico)
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    user: { // Referência ao usuário que fez o pedido
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // O modelo User que criamos
    },
    items: [orderItemSchema], // Array de itens do pedido
    shipping_address: { // Endereço de entrega
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip_code: { type: String, required: true },
    },
    payment_method: { type: String, required: true, enum: ['credit_card', 'pix'] },
    payment_status: { type: String, required: true, enum: ['pending', 'completed', 'failed'], default: 'completed' }, // Por enquanto, sempre 'completed' na simulação
    total_amount: { type: Number, required: true },
    isDelivered: { type: Boolean, required: true, default: false }, // Status de entrega
    deliveredAt: { type: Date }, // Data de entrega
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model('Order', orderSchema);