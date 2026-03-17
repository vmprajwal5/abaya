// In-memory store for failed login attempts
// In production, use Redis for distributed systems
const failedAttempts = new Map();
const lockedAccounts = new Map();

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Track failed login attempt
 * @param {string} identifier - Email or IP address
 * @returns {Object} - { attempts, locked, lockUntil }
 */
exports.trackFailedAttempt = (identifier) => {
  const now = Date.now();
  
  // Check if account is locked
  if (lockedAccounts.has(identifier)) {
    const lockUntil = lockedAccounts.get(identifier);
    if (now < lockUntil) {
      return {
        locked: true,
        lockUntil,
        attempts: MAX_ATTEMPTS,
      };
    } else {
      // Lock expired, clear it
      lockedAccounts.delete(identifier);
      failedAttempts.delete(identifier);
    }
  }

  // Get or initialize attempt record
  let record = failedAttempts.get(identifier) || {
    attempts: 0,
    firstAttempt: now,
  };

  // Reset if attempt window has passed
  if (now - record.firstAttempt > ATTEMPT_WINDOW) {
    record = {
      attempts: 1,
      firstAttempt: now,
    };
  } else {
    record.attempts += 1;
  }

  failedAttempts.set(identifier, record);

  // Lock account if max attempts reached
  if (record.attempts >= MAX_ATTEMPTS) {
    const lockUntil = now + LOCK_DURATION;
    lockedAccounts.set(identifier, lockUntil);
    
    return {
      locked: true,
      lockUntil,
      attempts: record.attempts,
    };
  }

  return {
    locked: false,
    attempts: record.attempts,
    remainingAttempts: MAX_ATTEMPTS - record.attempts,
  };
};

/**
 * Reset failed attempts on successful login
 * @param {string} identifier - Email or IP address
 */
exports.resetAttempts = (identifier) => {
  failedAttempts.delete(identifier);
  lockedAccounts.delete(identifier);
};

/**
 * Check if identifier is locked
 * @param {string} identifier - Email or IP address
 * @returns {Object} - { locked: boolean, lockUntil?: number }
 */
exports.isLocked = (identifier) => {
  const now = Date.now();
  
  if (lockedAccounts.has(identifier)) {
    const lockUntil = lockedAccounts.get(identifier);
    if (now < lockUntil) {
      return { locked: true, lockUntil };
    } else {
      lockedAccounts.delete(identifier);
      failedAttempts.delete(identifier);
    }
  }
  
  return { locked: false };
};

/**
 * Get current attempt count
 * @param {string} identifier - Email or IP address
 * @returns {number}
 */
exports.getAttemptCount = (identifier) => {
  const record = failedAttempts.get(identifier);
  return record ? record.attempts : 0;
};
