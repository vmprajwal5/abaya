const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB

async function analyzeSecurityLogs() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🔍 Analyzing Security Logs...\n');

  try {
    const db = mongoose.connection.db;
    
    // 1. Failed login attempts in last 24 hours
    const failedLogins = await db.collection('security_logs').aggregate([
      {
        $match: {
          event: 'AUTH_LOGIN_FAILED',
          timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$email',
          count: { $sum: 1 },
          ips: { $addToSet: '$ip' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    console.log('❌ Top Failed Login Attempts (24h):');
    failedLogins.forEach(item => {
      console.log(`  ${item._id}: ${item.count} attempts from ${item.ips.length} IPs`);
    });
    console.log('');

    // 2. Suspicious activities
    const suspicious = await db.collection('security_logs').find({
      event: 'SUSPICIOUS_ACTIVITY',
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).toArray();

    console.log(`🚨 Suspicious Activities (7 days): ${suspicious.length}`);
    suspicious.slice(0, 5).forEach(item => {
      console.log(`  ${item.type} - ${item.email || item.ip} - ${new Date(item.timestamp).toLocaleString()}`);
    });
    console.log('');

    // 3. Admin actions in last 7 days
    const adminActions = await db.collection('audit_logs').aggregate([
      {
        $match: {
          event: { $regex: /^ADMIN_/ },
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    console.log('👨💼 Admin Actions (7 days):');
    adminActions.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });
    console.log('');

    // 4. Error rate
    const errors = await db.collection('application_logs').countDocuments({
      level: 'error',
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    console.log(`⚠️  Total Errors (24h): ${errors}`);
    console.log('');

    // 5. Slow operations
    const slowOps = await db.collection('performance').find({
      event: 'SLOW_OPERATION',
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ duration: -1 }).limit(10).toArray();

    console.log('🐌 Slowest Operations (24h):');
    slowOps.forEach(item => {
      console.log(`  ${item.operation}: ${item.duration}ms`);
    });

  } catch (error) {
    console.error('Error analyzing logs:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run analysis
analyzeSecurityLogs();
