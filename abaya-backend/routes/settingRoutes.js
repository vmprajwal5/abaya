const express = require('express');
const router = express.Router();
const StoreSetting = require('../models/StoreSetting');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        let settings = await StoreSetting.findOne();

        if (!settings) {
            settings = await StoreSetting.create({
                siteName: 'Abaya Store',
                storeDescription: 'Welcome to our premium modest clothing store.',
                storeAddress: 'Male, Maldives',
                currency: 'MVR',
                taxRate: 6,
                orderPrefix: 'ABY-',
                supportEmail: 'support@abaya.com',
                supportPhone: '+960 1234567',
                shippingPrice: 50,
                freeShippingThreshold: 1000,
                socialLinks: {
                    instagram: 'https://instagram.com',
                    facebook: 'https://facebook.com',
                    whatsapp: 'https://wa.me/1234567',
                },
                announcementBar: {
                    show: false,
                    text: 'Welcome to our store!',
                },
            });
        }

        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/', protect, admin, async (req, res) => {
    try {
        let settings = await StoreSetting.findOne();

        if (!settings) {
            settings = new StoreSetting(req.body);
            await settings.save();
            return res.json(settings);
        }

        settings.siteName = req.body.siteName || settings.siteName;
        settings.storeDescription = req.body.storeDescription ?? settings.storeDescription;
        settings.storeAddress = req.body.storeAddress ?? settings.storeAddress;
        settings.currency = req.body.currency || settings.currency;
        settings.taxRate = req.body.taxRate ?? settings.taxRate;
        settings.orderPrefix = req.body.orderPrefix ?? settings.orderPrefix;
        settings.supportEmail = req.body.supportEmail || settings.supportEmail;
        settings.supportPhone = req.body.supportPhone || settings.supportPhone;
        settings.shippingPrice = req.body.shippingPrice ?? settings.shippingPrice;
        settings.freeShippingThreshold = req.body.freeShippingThreshold ?? settings.freeShippingThreshold;
        settings.socialLinks = { ...settings.socialLinks, ...req.body.socialLinks };
        settings.announcementBar = { ...settings.announcementBar, ...req.body.announcementBar };

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
