const passport = require('passport');
const { sendError } = require('../utils/response');

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return sendError(res, {
        statusCode: 401,
        message: info?.message || 'Unauthorized: Invalid or expired token',
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { authenticate };