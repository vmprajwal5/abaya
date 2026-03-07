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

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express.json());

// Root route - API health check
app.get('/', (req, res) => {
    res.json({ message: 'Abaya API is running ✅' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/newsletter', newsletterRoutes);

const __basedir = path.resolve(); // Common fix for ES Modules/CommonJS
app.use('/uploads', express.static(path.join(__basedir, '/uploads')));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ... (routes)

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
