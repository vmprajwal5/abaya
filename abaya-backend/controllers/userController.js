const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token (LOGIN)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    // Strict Input Validation
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide both email and password');
    }

    const user = await User.findOne({ email });

    // "The Gatekeeper": Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        // Generic error for security
        res.status(401);
        throw new Error('Invalid Email or Password');
    }
};

// @desc    Register a new user (SIGN UP)
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Validate Input
    if (!name || !email || !password) {
        res.status(400).json({ message: 'Please include all fields' });
        return;
    }

    // Password Strength
    if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
    }

    // Hash password before saving is usually handled in Model middleware,
    // but for simplicity, we can rely on the User model if you added a pre-save hook.
    // If not, we hash it here manually:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { authUser, registerUser, getUsers, deleteUser };