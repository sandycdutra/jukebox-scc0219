// backend/src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, 
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['vinyl', 'cd', 'accessory'], required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock_quantity: { type: Number, required: true, default: 0 },
    sold_quantity: { type: Number, default: 0 },
    images: [{ type: String }],
    metadata: {
        artist: { type: String },
        release_year: { type: Number },
        genre: { type: String },
        subgenre: { type: String },
        condition: { type: String, enum: ['new', 'used'], default: 'new' }
    }
}, { timestamps: true }); // Adiciona createdAt e updatedAt

module.exports = mongoose.model('Product', productSchema);