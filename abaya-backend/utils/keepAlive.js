const cron = require('node-cron');
const axios = require('axios');

// Ping self every 10 minutes to prevent sleep
const keepAlive = () => {
  const BACKEND_URL = process.env.BACKEND_URL || 'https://abaya-xthd.onrender.com';
  
  // Run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/health`);
      console.log('✅ Keep-alive ping successful:', new Date().toISOString());
    } catch (error) {
      console.log('❌ Keep-alive ping failed:', error.message);
    }
  });

  console.log('🔄 Keep-alive scheduler started');
};

module.exports = keepAlive;
