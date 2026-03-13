const express = require('express');
const router = express.Router();
const { addOrderItems, getOrders, getOrderById, updateOrderToDelivered, getOrderStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;