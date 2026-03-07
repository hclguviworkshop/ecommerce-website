const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');

router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', ctrl.getDashboard.bind(ctrl));

// Users
router.get('/users', ctrl.getUsers.bind(ctrl));
router.patch('/users/:id', ctrl.updateUser.bind(ctrl));

// Orders
router.get('/orders', ctrl.getOrders.bind(ctrl));
router.patch('/orders/:id', ctrl.updateOrder.bind(ctrl));

// Products
router.post('/products', ctrl.createProduct.bind(ctrl));
router.patch('/products/:id', ctrl.updateProduct.bind(ctrl));
router.delete('/products/:id', ctrl.deleteProduct.bind(ctrl));

// Categories
router.get('/categories', ctrl.getCategories.bind(ctrl));
router.post('/categories', ctrl.createCategory.bind(ctrl));
router.patch('/categories/:id', ctrl.updateCategory.bind(ctrl));
router.delete('/categories/:id', ctrl.deleteCategory.bind(ctrl));

module.exports = router;