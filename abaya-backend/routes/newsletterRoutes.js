const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, async (req, res) => {
    try {
        const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const subscriberExists = await Subscriber.findOne({ email });

        if (subscriberExists) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const subscriber = await Subscriber.create({
            email
        });

        res.status(201).json(subscriber);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
