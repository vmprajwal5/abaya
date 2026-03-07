const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config();

connectDB();

const createIndexes = async () => {
    try {
        console.log('Creating Indexes...');

        // User Indexes
        await User.collection.createIndex({ email: 1 }, { unique: true });
        console.log('User Index Created: email');

        // Product Indexes
        await Product.collection.createIndex({ category: 1 });
        await Product.collection.createIndex({ name: 'text', description: 'text' }); // Text search
        await Product.collection.createIndex({ price: 1 });
        console.log('Product Indexes Created: category, text search, price');

        // Order Indexes
        await Order.collection.createIndex({ user: 1 });
        await Order.collection.createIndex({ createdAt: -1 });
        console.log('Order Indexes Created: user, createdAt');

        console.log('All Indexes Created Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error creating indexes:', error);
        process.exit(1);
    }
};

createIndexes();
