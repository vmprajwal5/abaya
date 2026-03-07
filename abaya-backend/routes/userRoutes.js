const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route for User Registration (Sign Up)
router.post('/', registerUser);

// Route for User Login
router.post('/login', authUser);

// Admin Routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;