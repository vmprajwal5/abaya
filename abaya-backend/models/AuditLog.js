const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  actor: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    email: String,
    role: String,
    ip: String,
    userAgent: String,
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ACCESS'],
  },
  resource: {
    type: {
      type: String, // Product, Order, User, etc.
    },
    id: mongoose.Schema.Types.Mixed,
    name: String,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  severity: {
    type: String,
    enum: ['INFO', 'WARN', 'ERROR', 'CRITICAL'],
    default: 'INFO',
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE', 'PENDING'],
    default: 'SUCCESS',
  },
}, {
  timestamps: true,
});

// Indexes for fast querying
auditLogSchema.index({ 'actor.userId': 1, timestamp: -1 });
auditLogSchema.index({ event: 1, timestamp: -1 });
auditLogSchema.index({ 'resource.type': 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });

// Prevent deletion of audit logs
auditLogSchema.pre('remove', function(next) {
  const err = new Error('Audit logs cannot be deleted');
  next(err);
});

auditLogSchema.pre('findOneAndDelete', function(next) {
  const err = new Error('Audit logs cannot be deleted');
  next(err);
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
