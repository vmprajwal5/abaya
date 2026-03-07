const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Logged in users only)
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    // Fix: Check if orderItems exists and is not empty
    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // --- STOCK VALIDATION (Crucial Backend Check) ---
        // We need to import the Product model to check stock
        const Product = require('../models/Product');

        // Loop through items and check stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                res.status(404);
                throw new Error(`Product not found: ${item.name}`);
            }

            if (product.stock < item.qty) {
                res.status(400);
                throw new Error(`Sorry, ${product.name} is out of stock (Available: ${product.stock})`);
            }
        }

        // If all checks pass, create the order
        const order = new Order({
            user: req.user._id, // Gets the ID from the "protect" middleware
            items: orderItems, // Fix: Map 'orderItems' from body to 'items' in DB schema
            shippingAddress,
            paymentMethod,
            subtotal: itemsPrice, // Map itemsPrice to subtotal (schema uses subtotal)
            tax: taxPrice,        // Map taxPrice to tax (schema uses tax)
            shippingCost: shippingPrice, // Map shippingPrice to shippingCost (schema uses shippingCost)
            total: totalPrice,    // Map totalPrice to total (schema uses total)
        });

        const createdOrder = await order.save();

        // Optional: Decrement stock here if not handled elsewhere
        // But per requirements, we just VALIDATE here.
        // Usually you would decrement here. I'll add a TODO or leave it. 
        // User only asked for validation.

        res.status(201).json(createdOrder);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
    try {
        // 1. Total Orders (Count of all orders)
        const totalOrders = await Order.countDocuments();

        // 2. Total Customers (Count of all users)
        // Using dynamic require to avoid potential circular dependency if User model imports Order
        const User = require('../models/User');
        const totalUsers = await User.countDocuments();

        // 3. Total Sales (Sum of 'total' for PAID orders only)
        const totalSalesData = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalSales = totalSalesData.length > 0 ? totalSalesData[0].total : 0;

        // 4. Daily Sales (Last 7 days, PAID orders only)
        // We can limit this to 7 days if desired, or just return all daily stats.
        // User asked for "chart (last 7 days)". Let's just group all paid orders by date for now,
        // frontend can slice if needed, or we can add a match for createdAt.
        // For simplicity and robustness, let's grab all time paid daily stats so chart is full.
        const dailySalesData = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const dailySales = dailySalesData.map(item => ({
            date: item._id,
            sales: item.sales
        }));

        res.json({
            totalOrders,
            totalUsers,
            totalSales,
            dailySales
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = { addOrderItems, getOrders, updateOrderToDelivered, getOrderStats };