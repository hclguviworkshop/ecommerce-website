const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Runs express-validator checks and short-circuits with 422 on failure.
 */
const validate = (validations) => async (req, res, next) => {
  for (const validation of validations) {
    await validation.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, {
      statusCode: 422,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
};

module.exports = { validate };