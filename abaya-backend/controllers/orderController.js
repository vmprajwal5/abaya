const Order = require('../models/Order');

const addOrderItems = async (req, res) => {
    try {
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
            return res.status(400).json({ message: 'No order items' });
        } else {
            const Product = require('../models/Product');

            for (const item of orderItems) {
                const product = await Product.findById(item.product);

                if (!product) {
                    return res.status(404).json({ message: `Product not found: ${item.name}` });
                }

                if (product.stock < item.qty) {
                    return res.status(400).json({ message: `Sorry, ${product.name} is out of stock (Available: ${product.stock})` });
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
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