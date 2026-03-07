const cartService = require('../services/cart.service');
const { sendSuccess } = require('../utils/response');

class CartController {
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getOrCreate(req.user.id);
      const totals = cartService.calculateTotals(cart);
      sendSuccess(res, { data: { cart, ...totals } });
    } catch (err) {
      next(err);
    }
  }

  async addItem(req, res, next) {
    try {
      const cart = await cartService.addItem(req.user.id, req.body);
      const totals = cartService.calculateTotals(cart);
      sendSuccess(res, { message: 'Item added to cart', data: { cart, ...totals } });
    } catch (err) {
      next(err);
    }
  }

  async updateItem(req, res, next) {
    try {
      const cart = await cartService.updateItem(req.user.id, req.params.itemId, req.body);
      const totals = cartService.calculateTotals(cart);
      sendSuccess(res, { message: 'Cart updated', data: { cart, ...totals } });
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req, res, next) {
    try {
      const cart = await cartService.removeItem(req.user.id, req.params.itemId);
      const totals = cartService.calculateTotals(cart);
      sendSuccess(res, { message: 'Item removed from cart', data: { cart, ...totals } });
    } catch (err) {
      next(err);
    }
  }

  async clearCart(req, res, next) {
    try {
      await cartService.clear(req.user.id);
      sendSuccess(res, { message: 'Cart cleared' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();