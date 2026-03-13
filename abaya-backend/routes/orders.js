const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', protect, async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            tax,
            total,
            notes
        } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                user: req.user._id,
                items,
                shippingAddress,
                paymentMethod,
                subtotal,
                shippingCost,
                tax,
                total,
                notes
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
