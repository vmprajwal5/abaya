const express = require('express');
const router = express.Router();
const { addOrderItems, getOrders, updateOrderToDelivered, getOrderStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import the Bouncer

// We add 'protect' as the first argument. 
// If protect fails, 'addOrderItems' never runs.
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;