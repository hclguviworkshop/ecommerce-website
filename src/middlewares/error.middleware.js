const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  logger.error(err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return sendError(res, {
      statusCode: 400,
      message: 'Database validation error',
      errors: err.errors?.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, { statusCode: 401, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, { statusCode: 401, message: 'Token expired' });
  }

  // Custom app errors
  if (err.statusCode) {
    return sendError(res, { statusCode: err.statusCode, message: err.message });
  }

  // Unknown server errors
  sendError(res, {
    statusCode: 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

module.exports = errorMiddleware;