const mongoose = require('mongoose');

const storeSettingSchema = new mongoose.Schema({
    siteName: { type: String, required: true, default: 'My Store' },
    storeDescription: { type: String, default: 'Welcome to our premium modest clothing store.' },
    storeAddress: { type: String, default: 'Male, Maldives' },
    currency: { type: String, default: 'MVR' },
    taxRate: { type: Number, default: 6 },
    orderPrefix: { type: String, default: 'ORD-' },
    supportEmail: { type: String, required: true, default: 'support@example.com' },
    supportPhone: { type: String, required: true, default: '+1234567890' },
    shippingPrice: { type: Number, required: true, default: 50 },
    freeShippingThreshold: { type: Number, required: true, default: 1000 },
    socialLinks: {
        instagram: { type: String, default: '' },
        facebook: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
    },
    announcementBar: {
        show: { type: Boolean, default: false },
        text: { type: String, default: '' },
    },
    bankDetails: {
        accountName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        bankName: { type: String, default: 'Bank of Maldives' },
        instructions: { type: String, default: 'Please transfer the total amount to the following account and share the receipt.' }
    },
    seoSettings: {
        metaTitle: { type: String, default: '' },
        metaDescription: { type: String, default: '' },
        keywords: { type: String, default: '' }
    }
}, { timestamps: true });

module.exports = mongoose.model('StoreSetting', storeSettingSchema);
