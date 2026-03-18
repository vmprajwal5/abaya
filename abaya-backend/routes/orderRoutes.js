const express = require('express');
const router = express.Router();
const { addOrderItems, getOrders, getMyOrders, getOrderById, updateOrderToDelivered, updateOrderStatus, getOrderStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/my-orders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;