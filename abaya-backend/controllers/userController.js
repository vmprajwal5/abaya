const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid Email or Password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Please include all fields' });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
    }

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

const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const productId = req.params.productId;
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== req.params.productId
        );
        await user.save();
        res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

module.exports = { authUser, registerUser, getUsers, deleteUser, getWishlist, addToWishlist, removeFromWishlist };