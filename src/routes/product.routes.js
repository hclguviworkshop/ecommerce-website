const router = require('express').Router();
const ctrl = require('../controllers/product.controller');

// Public routes
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/slug/:slug', ctrl.getBySlug.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));

module.exports = router;