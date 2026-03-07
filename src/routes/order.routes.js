const router = require('express').Router();
const ctrl = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body } = require('express-validator');

router.use(authenticate);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate([
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
]), ctrl.create.bind(ctrl));
router.patch('/:id/cancel', ctrl.cancel.bind(ctrl));

module.exports = router;