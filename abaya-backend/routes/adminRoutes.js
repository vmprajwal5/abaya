const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');

// @desc    Get recent security logs
// @route   GET /api/admin/logs/security
// @access  Admin only
router.get('/logs/security', protect, authorize('admin'), async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    const logs = await db.collection('security_logs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching security logs',
    });
  }
});

// @desc    Get recent audit logs
// @route   GET /api/admin/logs/audit
// @access  Admin only
router.get('/logs/audit', protect, authorize('admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
    });
  }
});

// @desc    Get security statistics
// @route   GET /api/admin/logs/stats
// @access  Admin only
router.get('/logs/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = {
      authentication: {
        successfulLogins: await db.collection('security_logs').countDocuments({
          event: 'AUTH_LOGIN_SUCCESS',
          timestamp: { $gte: last24h }
        }),
        failedLogins: await db.collection('security_logs').countDocuments({
          event: 'AUTH_LOGIN_FAILED',
          timestamp: { $gte: last24h }
        }),
      },
      suspicious: await db.collection('security_logs').countDocuments({
        event: 'SUSPICIOUS_ACTIVITY',
        timestamp: { $gte: last24h }
      }),
      errors: await db.collection('application_logs').countDocuments({
        level: 'error',
        timestamp: { $gte: last24h }
      }),
    };

    res.json({
      success: true,
      period: '24 hours',
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
});

module.exports = router;
