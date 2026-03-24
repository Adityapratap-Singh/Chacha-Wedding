const AuditLog = require('../models/auditLog');

/**
 * Log an action to the database.
 * @param {string} user - The user who performed the action (email or 'System')
 * @param {string} action - The action performed (e.g., 'ADD_GUEST')
 * @param {string} target - What was affected
 * @param {string} segment - The category or segment affected
 * @param {object} before - Previous state (optional)
 * @param {object} after - New state (optional)
 * @param {object} details - Additional data
 * @param {string} ip - IP address of the user
 */
const logAction = async (user, action, target, segment = '', before = null, after = null, details = {}, ip = '') => {
  try {
    const log = new AuditLog({
      user: user || 'System',
      action,
      target,
      segment,
      before,
      after,
      details,
      ip,
    });
    await log.save();
  } catch (err) {
    console.error('Logging Error:', err.message);
  }
};

module.exports = { logAction };
