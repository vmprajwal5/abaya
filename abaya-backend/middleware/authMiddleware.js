const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check for token in cookies first (httpOnly)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('🍪 Token found in cookie');
    }
    // Then check Authorization header (backup)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('📨 Token found in header');
    }

    // No token found
    if (!token) {
        console.log('❌ No token found in cookie or header');
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified for user ID:', decoded.id);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            console.log('❌ User not found for token');
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        console.log('✅ User authenticated:', req.user.email);
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
        });
    }
};

// Authorize specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

// Admin middleware - checks isAdmin flag
exports.admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};