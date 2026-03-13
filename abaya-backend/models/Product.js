const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },

    fabric: { type: String, required: true },

    category: {
        type: String,
        required: true,
        enum: ['Classic', 'Luxury', 'Occasion', 'Casual', 'Modest Sets', 'Hijabs']
    },
    brand: { type: String, required: false, default: 'Abaya Clothing' },

    image: { type: String, required: true },
    images: [{ type: String }],

    sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', '50', '52', '54', '56', '58', '60']
    }],

    colors: [{
        name: String,
        hex: String
    }],

    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);