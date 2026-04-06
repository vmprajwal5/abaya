const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://abaya-xnxa.vercel.app',
    'https://abayaclothing-obn3wtgx7-vmprajwal5s-projects.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || 
            allowedOrigins.includes(origin) || 
            allowedOrigins.includes('*') ||
            (origin && origin.endsWith('.vercel.app')) ||
            (origin && origin.endsWith('.onrender.com')) ||
            (origin && origin.startsWith('http://localhost:')) ||
            (origin && origin.startsWith('http://127.0.0.1:'))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Abaya API is running ✅' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/messages', require('./routes/messageRoutes'));

const __basedir = path.resolve();
app.use('/uploads', express.static(path.join(__basedir, '/uploads')));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
