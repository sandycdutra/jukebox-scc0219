// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sub-schema para o endereço 
const addressSchema = new mongoose.Schema({
    id: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
    phone: { type: String },
    isDefault: { type: Boolean, default: false }
});

const paymentMethodSchema = new mongoose.Schema({
    id: { type: String, required: true }, // ID único para o cartão (UUID)
    cardType: { type: String }, // Ex: 'Visa', 'Mastercard', 'Pix' (se quiser salvar PIX)
    cardNumberLast4: { type: String, required: true }, // Apenas os últimos 4 dígitos
    cardName: { type: String, required: true }, // Nome no cartão
    cardExpiry: { type: String, required: true }, // MM/YY
    isDefault: { type: Boolean, default: false } // Para marcar um cartão como padrão
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    addresses: [addressSchema], // Array de endereços (já existente)
    payment_methods: [paymentMethodSchema], // <--- NOVO: Array de métodos de pagamento/cartões
    
    favorite_products: [{ type: String }],
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);