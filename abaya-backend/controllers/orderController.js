const Order = require('../models/Order');

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

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const Product = require('../models/Product');

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

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal: itemsPrice,
            tax: taxPrice,
            shippingCost: shippingPrice,
            total: totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
};

const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

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

const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const User = require('../models/User');
        const totalUsers = await User.countDocuments();

        const totalSalesData = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalSales = totalSalesData.length > 0 ? totalSalesData[0].total : 0;

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