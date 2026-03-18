const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log("Connected to MongoDB.");
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(5).lean();
    console.log("Recent Orders (count: " + orders.length + "):");
    console.log(JSON.stringify(orders, null, 2));
    process.exit(0);
}).catch((err) => {
    console.error("DB Error:", err);
    process.exit(1);
});
