const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { apiLimiter, speedLimiter } = require('./config/security');
const { securityHeaders } = require('./config/security');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ═══════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE (ORDER MATTERS!)
// ═══════════════════════════════════════════════════════════

const { 
  httpRequestLogger, 
  requestId,
  trackPerformance 
} = require('./middleware/logging');
const { logger } = require('./config/logger');

// Request ID tracking
app.use(requestId);

// HTTP request logging
app.use(httpRequestLogger);

// Performance tracking
app.use(trackPerformance);

// 1. Set security HTTP headers
app.use(helmet(securityHeaders));

// 2. Enable CORS with credentials
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://abaya-xnxa.vercel.app',
  'https://abaya-xnxa-git-main-vmprajwal5s-projects.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (for preview deployments)
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 3. Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Cookie parser (MUST be before routes that use cookies)
app.use(cookieParser());

// 5. Sanitize data (prevent NoSQL injection)
app.use(mongoSanitize());

// 6. Prevent XSS attacks
app.use(xss());

// 7. Prevent HTTP Parameter Pollution
app.use(hpp());

// 8. Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/', speedLimiter);

// 9. Request logging (add if you have morgan)
// Replaced by Winston + Morgan logging in tracking

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Abaya API is running ✅',
    security: 'Enhanced ✅',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
const { logError } = require('./middleware/logging');

app.use((err, req, res, next) => {
  // Log error
  logError(err, req, {
    statusCode: err.statusCode || 500,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(err.statusCode || 500).json({
    success: false,
    message,
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err,
    }),
  });
});

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  // Log server startup
  logger.info('Server starting...', {
    environment: process.env.NODE_ENV,
    port: PORT,
    nodeVersion: process.version,
    platform: process.platform,
  });

  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚀 Abaya E-commerce API Server Running                  ║
║                                                           ║
║  Environment: ${process.env.NODE_ENV}                              
║  Port: ${PORT}                                            ║
║  Security: Enhanced ✅                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', {
    error: error.message,
    stack: error.stack,
  });
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Log shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
