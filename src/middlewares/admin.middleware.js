const { sendError } = require('../utils/response');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, {
      statusCode: 403,
      message: 'Forbidden: Admin access required',
    });
  }
  next();
};

module.exports = { requireAdmin };