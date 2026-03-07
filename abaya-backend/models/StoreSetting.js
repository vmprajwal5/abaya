const mongoose = require('mongoose');

const storeSettingSchema = new mongoose.Schema({
    siteName: { type: String, required: true, default: 'My Store' },
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
}, { timestamps: true });

module.exports = mongoose.model('StoreSetting', storeSettingSchema);
