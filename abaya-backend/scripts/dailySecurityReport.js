const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function generateDailyReport() {
  await mongoose.connect(process.env.MONGODB_URI);

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const today = new Date();
  
  const report = {
    date: today.toISOString().split('T')[0],
    period: `${yesterday.toLocaleString()} - ${today.toLocaleString()}`,
    summary: {},
    details: {},
  };

  try {
    const db = mongoose.connection.db;

    // Authentication statistics
    const loginSuccess = await db.collection('security_logs').countDocuments({
      event: 'AUTH_LOGIN_SUCCESS',
      timestamp: { $gte: yesterday }
    });

    const loginFailed = await db.collection('security_logs').countDocuments({
      event: 'AUTH_LOGIN_FAILED',
      timestamp: { $gte: yesterday }
    });

    const registrations = await db.collection('security_logs').countDocuments({
      event: 'AUTH_REGISTER_SUCCESS',
      timestamp: { $gte: yesterday }
    });

    report.summary.authentication = {
      successfulLogins: loginSuccess,
      failedLogins: loginFailed,
      newRegistrations: registrations,
      loginSuccessRate: ((loginSuccess / (loginSuccess + loginFailed)) * 100).toFixed(2) + '%',
    };

    // Security incidents
    const suspiciousActivities = await db.collection('security_logs').countDocuments({
      event: 'SUSPICIOUS_ACTIVITY',
      timestamp: { $gte: yesterday }
    });

    const accountLockouts = await db.collection('security_logs').countDocuments({
      type: 'BRUTE_FORCE_ATTEMPT',
      timestamp: { $gte: yesterday }
    });

    report.summary.security = {
      suspiciousActivities,
      accountLockouts,
      passwordChanges: await db.collection('security_logs').countDocuments({
        event: 'SECURITY_PASSWORD_CHANGED',
        timestamp: { $gte: yesterday }
      }),
    };

    // Orders
    const ordersCreated = await db.collection('audit_logs').countDocuments({
      event: 'ORDER_CREATED',
      timestamp: { $gte: yesterday }
    });

    const ordersCancelled = await db.collection('audit_logs').countDocuments({
      event: 'ORDER_CANCELLED',
      timestamp: { $gte: yesterday }
    });

    report.summary.orders = {
      created: ordersCreated,
      cancelled: ordersCancelled,
      cancellationRate: ((ordersCancelled / ordersCreated) * 100).toFixed(2) + '%',
    };

    // Admin actions
    const adminActions = await db.collection('audit_logs').countDocuments({
      event: { $regex: /^ADMIN_/ },
      timestamp: { $gte: yesterday }
    });

    report.summary.admin = {
      totalActions: adminActions,
    };

    // Errors
    const errors = await db.collection('application_logs').countDocuments({
      level: 'error',
      timestamp: { $gte: yesterday }
    });

    report.summary.errors = {
      total: errors,
    };

    // Save report
    const reportPath = path.join(__dirname, '../logs/reports', `security-report-${report.date}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('✅ Daily security report generated');
    console.log(JSON.stringify(report.summary, null, 2));

  } catch (error) {
    console.error('Error generating report:', error);
  } finally {
    await mongoose.connection.close();
  }
}

generateDailyReport();
