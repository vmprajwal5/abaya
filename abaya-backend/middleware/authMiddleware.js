const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if the "Authorization" header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Get the token from the header (remove "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 3. Decode the token to get the User ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user in the DB and attach it to the request object
            // We exclude the password for security
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Pass the user to the Controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };