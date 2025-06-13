// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para fazer hash de senhas

const userSchema = new mongoose.Schema({
    // id: { type: String, required: true, unique: true }, // Se você quiser usar um ID customizado além do _id do Mongo
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // A senha hashed
    name: { type: String, required: true },
    phone: { type: String },
    // CEP como objeto aninhado (conforme sua proposta)
    cep: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip_code: { type: String },
    },
    // Array para IDs de produtos favoritos
    favorite_products: [{ type: String }], // Armazena IDs de produtos (strings)
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' } // Papel do usuário
}, { timestamps: true }); // Adiciona createdAt e updatedAt

// Middleware de Mongoose: Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { // Só faz hash se a senha foi modificada
        next();
    }
    const salt = await bcrypt.genSalt(10); // Gera um salt
    this.password = await bcrypt.hash(this.password, salt); // Faz hash da senha
    next();
});

// Método para comparar senha (no login)
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);