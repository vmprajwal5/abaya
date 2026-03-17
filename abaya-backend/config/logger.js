const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { MongoDB } = require('winston-mongodb');
const path = require('path');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// ═══════════════════════════════════════════════════════════════
// APPLICATION LOGGER (General app logs)
// ═══════════════════════════════════════════════════════════════

const applicationLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'abaya-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console output (development)
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug',
    }),

    // Error logs - separate file
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    }),

    // Combined logs - all levels
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    }),

    // MongoDB storage (if URI provided)
    ...(process.env.MONGODB_URI ? [
      new MongoDB({
        db: process.env.MONGODB_URI,
        collection: 'application_logs',
        level: 'info',
        storeHost: true,
        capped: true,
        cappedSize: 100000000, // 100MB
        expireAfterSeconds: 2592000, // 30 days
      })
    ] : []),
  ],
});

// ═══════════════════════════════════════════════════════════════
// SECURITY LOGGER (Authentication, authorization, security events)
// ═══════════════════════════════════════════════════════════════

const securityLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'abaya-security',
    logType: 'security'
  },
  transports: [
    // Console (development only)
    ...(process.env.NODE_ENV === 'development' ? [
      new winston.transports.Console({
        format: consoleFormat,
      })
    ] : []),

    // Security logs file - NEVER rotate, archive monthly
    new DailyRotateFile({
      filename: 'logs/security-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '180d', // 6 months
      zippedArchive: true,
    }),

    // MongoDB storage
    ...(process.env.MONGODB_URI ? [
      new MongoDB({
        db: process.env.MONGODB_URI,
        collection: 'security_logs',
        storeHost: true,
        expireAfterSeconds: 15552000, // 180 days
      })
    ] : []),
  ],
});

// ═══════════════════════════════════════════════════════════════
// AUDIT LOGGER (Admin actions, critical operations)
// ═══════════════════════════════════════════════════════════════

const auditLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'abaya-audit',
    logType: 'audit'
  },
  transports: [
    // Audit logs - permanent storage
    new DailyRotateFile({
      filename: 'logs/audit-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '365d', // 1 year minimum (extend for compliance)
      zippedArchive: true,
    }),

    // MongoDB storage - NO EXPIRATION
    ...(process.env.MONGODB_URI ? [
      new MongoDB({
        db: process.env.MONGODB_URI,
        collection: 'audit_logs',
        storeHost: true,
        // NO expireAfterSeconds - keep forever
      })
    ] : []),
  ],
});

// ═══════════════════════════════════════════════════════════════
// HTTP ACCESS LOGGER (Request/Response logs)
// ═══════════════════════════════════════════════════════════════

const httpLogger = winston.createLogger({
  level: 'http',
  format: logFormat,
  defaultMeta: { 
    service: 'abaya-http',
    logType: 'http'
  },
  transports: [
    new DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '100m',
      maxFiles: '30d',
      zippedArchive: true,
    }),
  ],
});

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE LOGGER (Slow queries, performance metrics)
// ═══════════════════════════════════════════════════════════════

const performanceLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'abaya-performance',
    logType: 'performance'
  },
  transports: [
    new DailyRotateFile({
      filename: 'logs/performance-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
});

// Export all loggers
module.exports = {
  logger: applicationLogger,
  securityLogger,
  auditLogger,
  httpLogger,
  performanceLogger,
};
