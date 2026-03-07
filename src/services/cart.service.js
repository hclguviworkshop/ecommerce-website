const { Cart, CartItem, Product } = require('../models');

class CartService {
  async getOrCreate(userId) {
    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price', 'images', 'stock', 'isActive'] }],
        },
      ],
    });
    if (!cart) {
      cart = await Cart.create({ userId });
      cart.items = [];
    }
    return cart;
  }

  async addItem(userId, { productId, quantity = 1 }) {
    const product = await Product.findOne({ where: { id: productId, isActive: true } });
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    if (product.stock < quantity) {
      const err = new Error('Insufficient stock');
      err.statusCode = 400;
      throw err;
    }

    const cart = await this.getOrCreate(userId);

    const [item, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { quantity, priceAtAdd: product.price },
    });

    if (!created) {
      const newQty = item.quantity + quantity;
      if (product.stock < newQty) {
        const err = new Error('Insufficient stock');
        err.statusCode = 400;
        throw err;
      }
      await item.update({ quantity: newQty });
    }

    return this.getOrCreate(userId);
  }

  async updateItem(userId, cartItemId, { quantity }) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      const err = new Error('Cart not found');
      err.statusCode = 404;
      throw err;
    }

    const item = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id }, include: [{ model: Product, as: 'product' }] });
    if (!item) {
      const err = new Error('Cart item not found');
      err.statusCode = 404;
      throw err;
    }

    if (item.product.stock < quantity) {
      const err = new Error('Insufficient stock');
      err.statusCode = 400;
      throw err;
    }

    if (quantity <= 0) {
      await item.destroy();
    } else {
      await item.update({ quantity });
    }

    return this.getOrCreate(userId);
  }

  async removeItem(userId, cartItemId) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      const err = new Error('Cart not found');
      err.statusCode = 404;
      throw err;
    }

    const item = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id } });
    if (!item) {
      const err = new Error('Cart item not found');
      err.statusCode = 404;
      throw err;
    }

    await item.destroy();
    return this.getOrCreate(userId);
  }

  async clear(userId) {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
  }

  calculateTotals(cart) {
    const items = cart.items || [];
    const subtotal = items.reduce((sum, item) => {
      return sum + parseFloat(item.product?.price || item.priceAtAdd) * item.quantity;
    }, 0);
    return { subtotal: subtotal.toFixed(2), itemCount: items.length };
  }
}

module.exports = new CartService();