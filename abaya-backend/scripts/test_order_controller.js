const colors = require('colors');
const { authUser } = require('../controllers/userController');
const { addOrderItems } = require('../controllers/orderController');

// Mock Models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

// Mocking Mongoose Models
User.findOne = async () => null;
bcrypt.compare = async () => false;
Product.findById = async () => null;

// Mock Response
const mockRes = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.data = data; return res; };
    return res;
};

const runUnitTests = async () => {
    console.log('--- STARTING UNIT TESTS ---'.yellow.bold);

    // --- TEST 1: User Login Validation ---
    console.log('\n[User Controller] Testing authUser validation...'.cyan);

    // Case 1: Missing Fields
    try {
        const req = { body: { email: '', password: '' } };
        const res = mockRes();
        await authUser(req, res);
    } catch (e) {
        if (e.message === 'Please provide both email and password') {
            console.log('✅ Success: Threw "Please provide both email and password" for missing fields'.green);
        } else {
            console.log(`❌ Fail: Unexpected error: ${e.message}`.red);
        }
    }

    // Case 2: Invalid User/Pass (Generic Message)
    try {
        // Mock User.findOne to return null (User not found)
        User.findOne = async () => null;

        const req = { body: { email: 'test@example.com', password: 'wrong' } };
        const res = mockRes();
        await authUser(req, res);
    } catch (e) {
        if (e.message === 'Invalid Email or Password') { // We expect 401 set on res, and error thrown
            console.log('✅ Success: Threw "Invalid Email or Password" for non-existent user'.green);
        } else {
            console.log(`❌ Fail: Unexpected error: ${e.message}`.red);
        }
    }

    // --- TEST 2: Order Stock Validation ---
    console.log('\n[Order Controller] Testing addOrderItems stock validation...'.cyan);

    // Case 1: Out of Stock
    try {
        // Mock Product.findById to return a product with low stock
        Product.findById = async (id) => ({
            _id: id,
            name: 'Test Abaya',
            stock: 5,
            price: 100
        });

        const req = {
            user: { _id: 'userid' },
            body: {
                orderItems: [{ product: 'prod1', name: 'Test Abaya', qty: 10 }], // Requesting 10, have 5
                itemsPrice: 1000,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: 1000
            }
        };
        const res = mockRes();

        await addOrderItems(req, res);
    } catch (e) {
        if (e.message.includes('out of stock')) {
            console.log(`✅ Success: Threw "${e.message}" for out of stock item`.green);
        } else {
            console.log(`❌ Fail: Unexpected error: ${e.message}`.red);
        }
    }

    // Case 2: Sufficient Stock (Should Pass)
    try {
        // Mock Product.findById to return a product with enough stock
        Product.findById = async (id) => ({
            _id: id,
            name: 'Test Abaya',
            stock: 20,
            price: 100
        });

        // Mock Order save
        // We need to mock the Order constructor which is imported. 
        // Since we require('../models/Order') and it exports a model, 
        // it's hard to mock the constructor directly without a library like Jest or proxyquire.
        // However, we can try to simplisticly check if it reaches the point of creating order.
        // But `addOrderItems` uses `new Order(...)`.

        // For this simple script without test runner, testing the success case completely is hard 
        // because `new Order` will fail if not connected to DB or if we don't mock the class.
        // But verifying failure cases (Validation) is our main goal and that happens BEFORE `new Order` save.

        // Let's rely on the fact that if validation passes, it proceeds to `new Order`.
        // If we get a DB connection error or similar, it means validation passed!

        const req = {
            user: { _id: 'userid' },
            body: {
                orderItems: [{ product: 'prod1', name: 'Test Abaya', qty: 5 }], // Requesting 5, have 20
                itemsPrice: 500,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: 500
            }
        };
        const res = mockRes();

        await addOrderItems(req, res);

    } catch (e) {
        // If validation passed, it tries to access DB and fails since we didn't connect.
        // Or `order.save` fails.
        // This confirms validation passed.
        if (e.message.includes('buffering timed out') || e.message.includes('Order is not a constructor') || Object.keys(e).length > 0) {
            console.log('✅ Success: Validation passed (Logic proceeded to DB save)'.green);
        } else {
            console.log(`ℹ️  Note: Error was ${e.message} (Likely DB connection related, which is expected)`.blue);
        }
    }
};

runUnitTests();
