const router = require('express').Router();
const ctrl = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { body } = require('express-validator');

router.use(authenticate);

router.get('/', ctrl.getCart.bind(ctrl));
router.post('/items', validate([
  body('productId').isUUID().withMessage('Valid product ID required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]), ctrl.addItem.bind(ctrl));
router.patch('/items/:itemId', validate([
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
]), ctrl.updateItem.bind(ctrl));
router.delete('/items/:itemId', ctrl.removeItem.bind(ctrl));
router.delete('/', ctrl.clearCart.bind(ctrl));

module.exports = router;