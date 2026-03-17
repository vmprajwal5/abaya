const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const { 
  logger, 
  securityLogger, 
  auditLogger,
  httpLogger,
  performanceLogger 
} = require('../config/logger');

// ═══════════════════════════════════════════════════════════════
// REQUEST ID MIDDLEWARE (Track requests across logs)
// ═══════════════════════════════════════════════════════════════

exports.requestId = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// ═══════════════════════════════════════════════════════════════
// HTTP REQUEST LOGGER (Morgan + Winston)
// ═══════════════════════════════════════════════════════════════

// Custom Morgan tokens
morgan.token('id', (req) => req.id);
morgan.token('user-id', (req) => req.user?.id || 'anonymous');
morgan.token('user-email', (req) => req.user?.email || 'N/A');

// Morgan format
const morganFormat = ':id :remote-addr :user-id ":method :url" :status :response-time ms - :res[content-length]';

exports.httpRequestLogger = morgan(morganFormat, {
  stream: {
    write: (message) => httpLogger.http(message.trim()),
  },
  skip: (req) => {
    // Skip health checks and static files
    return req.url === '/api/health' || req.url === '/';
  },
});

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION EVENT LOGGING
// ═══════════════════════════════════════════════════════════════

exports.logAuth = (event, data) => {
  securityLogger.info({
    event: `AUTH_${event}`,
    timestamp: new Date().toISOString(),
    ...data,
  });
};

// ═══════════════════════════════════════════════════════════════
// SECURITY EVENT LOGGING
// ═══════════════════════════════════════════════════════════════

exports.logSecurity = (event, severity, data) => {
  const logLevel = {
    LOW: 'info',
    MEDIUM: 'warn',
    HIGH: 'error',
    CRITICAL: 'error',
  }[severity] || 'info';

  securityLogger[logLevel]({
    event: `SECURITY_${event}`,
    severity,
    timestamp: new Date().toISOString(),
    ...data,
  });
};

// ═══════════════════════════════════════════════════════════════
// ADMIN ACTION LOGGING (Audit Trail)
// ═══════════════════════════════════════════════════════════════

exports.logAdminAction = (action, admin, data) => {
  auditLogger.info({
    event: `ADMIN_${action}`,
    timestamp: new Date().toISOString(),
    actor: {
      adminId: admin._id,
      adminEmail: admin.email,
      adminRole: admin.role,
    },
    ...data,
  });
};

// ═══════════════════════════════════════════════════════════════
// ORDER EVENT LOGGING
// ═══════════════════════════════════════════════════════════════

exports.logOrder = (event, order, user, additionalData = {}) => {
  logger.info({
    event: `ORDER_${event}`,
    timestamp: new Date().toISOString(),
    orderId: order._id || order.orderNumber,
    orderNumber: order.orderNumber,
    userId: user?._id,
    userEmail: user?.email,
    amount: order.totalPrice,
    itemCount: order.items?.length,
    ...additionalData,
  });

  // Also log to audit for financial transactions
  if (['CREATED', 'CANCELLED', 'REFUNDED'].includes(event)) {
    auditLogger.info({
      event: `ORDER_${event}`,
      timestamp: new Date().toISOString(),
      orderId: order._id || order.orderNumber,
      orderNumber: order.orderNumber,
      userId: user?._id,
      amount: order.totalPrice,
      ...additionalData,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// SUSPICIOUS ACTIVITY LOGGING
// ═══════════════════════════════════════════════════════════════

exports.logSuspicious = (type, data) => {
  securityLogger.warn({
    event: 'SUSPICIOUS_ACTIVITY',
    type,
    severity: 'HIGH',
    timestamp: new Date().toISOString(),
    ...data,
  });

  // Also log to application for visibility
  logger.warn({
    event: 'SUSPICIOUS_ACTIVITY',
    type,
    ...data,
  });
};

// ═══════════════════════════════════════════════════════════════
// DATA ACCESS LOGGING (GDPR Compliance)
// ═══════════════════════════════════════════════════════════════

exports.logDataAccess = (dataType, accessor, resource, purpose = '') => {
  auditLogger.info({
    event: 'DATA_ACCESS',
    timestamp: new Date().toISOString(),
    dataType,
    accessor: {
      userId: accessor._id,
      userEmail: accessor.email,
      userRole: accessor.role,
    },
    resource: {
      type: resource.type || 'unknown',
      id: resource.id,
    },
    purpose,
  });
};

// ═══════════════════════════════════════════════════════════════
// ERROR LOGGING
// ═══════════════════════════════════════════════════════════════

exports.logError = (error, req = null, additionalData = {}) => {
  const errorLog = {
    event: 'ERROR',
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    ...(req && {
      request: {
        id: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userId: req.user?.id,
      },
    }),
    ...additionalData,
  };

  logger.error(errorLog);
};

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE LOGGING
// ═══════════════════════════════════════════════════════════════

exports.logPerformance = (operation, duration, metadata = {}) => {
  performanceLogger.info({
    event: 'PERFORMANCE',
    operation,
    duration,
    timestamp: new Date().toISOString(),
    ...metadata,
  });

  // Warn if operation is slow
  if (duration > 1000) { // 1 second
    performanceLogger.warn({
      event: 'SLOW_OPERATION',
      operation,
      duration,
      threshold: 1000,
      ...metadata,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE TRACKING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

exports.trackPerformance = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests
    if (duration > 500) { // 500ms threshold
      performanceLogger.warn({
        event: 'SLOW_REQUEST',
        requestId: req.id,
        method: req.method,
        url: req.url,
        duration,
        statusCode: res.statusCode,
        userId: req.user?.id,
      });
    }
  });

  next();
};

// ═══════════════════════════════════════════════════════════════
// DATABASE QUERY LOGGING
// ═══════════════════════════════════════════════════════════════

exports.logDatabaseQuery = (operation, model, duration, query = {}) => {
  const log = {
    event: 'DATABASE_QUERY',
    operation,
    model,
    duration,
    timestamp: new Date().toISOString(),
  };

  // Log slow queries
  if (duration > 100) { // 100ms threshold
    performanceLogger.warn({
      ...log,
      event: 'SLOW_QUERY',
      threshold: 100,
      query: JSON.stringify(query),
    });
  } else {
    performanceLogger.info(log);
  }
};
