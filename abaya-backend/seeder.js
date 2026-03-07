const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db'); // Assuming this exists, based on project structure

dotenv.config();

// Connect to DB manually if connectDB isn't exporting a function or if we want clearer control
// However, reusing the existing config is best practice. 
// If connectDB is not found or fails, we can fallback to inline connection.
const connect = async () => {
    try {
        // Attempt to load db config
        const dbConfig = require('./config/db');
        if (typeof dbConfig === 'function') {
            await dbConfig();
        } else {
            // Fallback if config/db.js exports something else or nothing relevant
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`.red.inverse);
        // If config/db doesn't handle connection, try manual connection
        if (process.env.MONGO_URI) {
            try {
                const conn = await mongoose.connect(process.env.MONGO_URI);
                console.log(`MongoDB Connected (Fallback): ${conn.connection.host}`.cyan.underline);
            } catch (err) {
                console.error(`Fallback Error: ${err.message}`.red.inverse);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }
};


const importData = async () => {
    try {
        await connect();

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.create(users);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connect();

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
