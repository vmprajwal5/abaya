const { logger, securityLogger, auditLogger, performanceLogger } = require('../config/logger');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Create some test logs
  logger.info('Test application log for verification');
  securityLogger.info({ event: 'AUTH_REGISTER_SUCCESS', email: 'test@example.com', ip: '127.0.0.1' });
  securityLogger.warn({ event: 'AUTH_LOGIN_FAILED', email: 'test@example.com', ip: '127.0.0.1' });
  auditLogger.info({ event: 'ORDER_CREATED', orderId: '12345', amount: 99.99 });
  auditLogger.info({ event: 'ADMIN_PRODUCT_MODIFIED', productId: '67890' });
  performanceLogger.info({ event: 'SPEED_TEST', duration: 120 });
  logger.error(new Error('Test error log'));
  
  // Wait for Winston to flush
  setTimeout(async () => {
    try {
      const db = mongoose.connection.db;
      const appLogs = await db.collection('application_logs').countDocuments();
      const secLogs = await db.collection('security_logs').countDocuments();
      const audLogs = await db.collection('audit_logs').countDocuments();
      console.log(`\n✅ MongoDB Logs -> App: ${appLogs}, Security: ${secLogs}, Audit: ${audLogs}`);
      
      const fs = require('fs');
      const files = fs.readdirSync('../logs');
      console.log(`\n✅ Local Log Files Created: ${files.join(', ')}`);
      
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }, 3000);
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
