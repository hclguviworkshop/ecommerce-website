const { sequelize, Order, OrderItem, Cart, CartItem, Product, User } = require('../models');

class OrderService {
  async create(userId, { shippingAddress, paymentMethod, notes } = {}) {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    if (!cart || !cart.items.length) {
      const err = new Error('Cart is empty');
      err.statusCode = 400;
      throw err;
    }

    // Validate stock
    for (const item of cart.items) {
      if (!item.product.isActive) throw Object.assign(new Error(`Product "${item.product.name}" is no longer available`), { statusCode: 400 });
      if (item.product.stock < item.quantity) throw Object.assign(new Error(`Insufficient stock for "${item.product.name}"`), { statusCode: 400 });
    }

    return sequelize.transaction(async (t) => {
      const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
      const taxAmount = subtotal * 0.1; // 10% tax
      const shippingAmount = subtotal >= 50 ? 0 : 5.99;
      const total = subtotal + taxAmount + shippingAmount;

      const order = await Order.create({
        userId,
        subtotal: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        shippingAmount: shippingAmount.toFixed(2),
        total: total.toFixed(2),
        shippingAddress,
        paymentMethod,
        notes,
      }, { transaction: t });

      await Promise.all(cart.items.map((item) =>
        OrderItem.create({
          orderId: order.id,
          productId: item.product.id,
          productName: item.product.name,
          productSku: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: (parseFloat(item.product.price) * item.quantity).toFixed(2),
        }, { transaction: t })
      ));

      // Decrement stock
      await Promise.all(cart.items.map((item) =>
        item.product.decrement('stock', { by: item.quantity, transaction: t })
      ));

      // Clear cart
      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      return this.getById(order.id, userId);
    });
  }

  async getAll(userId, { page = 1, limit = 10, status } = {}) {
    const where = { userId };
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images'] }] }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    return { orders: rows, total: count };
  }

  async getById(orderId, userId = null) {
    const where = { id: orderId };
    if (userId) where.userId = userId;

    const order = await Order.findOne({
      where,
      include: [
        {
          model: OrderItem, as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images'] }],
        },
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
    });

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return order;
  }

  async cancel(orderId, userId) {
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      const err = new Error('Order cannot be cancelled at this stage');
      err.statusCode = 400;
      throw err;
    }
    await order.update({ status: 'cancelled' });
    return order;
  }
}

module.exports = new OrderService();