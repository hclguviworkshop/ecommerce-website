const router = require('express').Router();
const passport = require('passport');
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body } = require('express-validator');

const registerRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', validate(registerRules), ctrl.register.bind(ctrl));
router.post('/login', validate(loginRules), ctrl.login.bind(ctrl));
router.post('/refresh', ctrl.refreshToken.bind(ctrl));
router.post('/logout', ctrl.logout.bind(ctrl));
router.post('/logout-all', authenticate, ctrl.logoutAll.bind(ctrl));
router.get('/me', authenticate, ctrl.me.bind(ctrl));

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  ctrl.googleCallback.bind(ctrl)
);

module.exports = router;