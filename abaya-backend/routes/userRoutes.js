const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUsers, deleteUser, getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/userController');
const { forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/', registerUser);

router.post('/login', authUser);

// Wishlist routes (protected)
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;