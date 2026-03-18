const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
        image: { type: String }
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'paypal', 'cod', 'bml', 'transfer']
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'completed', 'failed']
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingCost: {
        type: Number,
        required: true,
        default: 0.0
    },
    tax: {
        type: Number,
        required: true,
        default: 0.0
    },
    total: {
        type: Number,
        required: true,
        default: 0.0
    },
    currency: {
        type: String,
        default: 'MVR'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

orderSchema.pre('validate', async function (next) {
    if (!this.orderNumber) {
        const StoreSetting = mongoose.model('StoreSetting')
        const settings = await StoreSetting.findOne()
        const prefix = settings?.orderPrefix || 'ORD-'
        
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `${prefix}${timestamp}-${random}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
