const { sequelize, User, Order, Product, Category, OrderItem } = require('../models');
const { Op } = require('sequelize');

class AdminService {
  async getDashboardStats() {
    const [totalUsers, totalOrders, totalProducts, revenueResult] = await Promise.all([
      User.count({ where: { role: 'customer', isActive: true } }),
      Order.count(),
      Product.count({ where: { isActive: true } }),
      Order.findOne({
        attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'revenue']],
        where: { paymentStatus: 'paid' },
        raw: true,
      }),
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [newUsers, recentOrders] = await Promise.all([
      User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo }, role: 'customer' } }),
      Order.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: parseFloat(revenueResult?.revenue || 0).toFixed(2),
      newUsersLast30Days: newUsers,
      ordersLast30Days: recentOrders,
    };
  }

  async getUsers({ page = 1, limit = 20, search, role } = {}) {
    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });
    return { users: rows, total: count };
  }

  async updateUserStatus(userId, { isActive, role }) {
    const user = await User.findByPk(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role !== undefined) updates.role = role;
    return user.update(updates);
  }

  async getAllOrders({ page = 1, limit = 20, status, paymentStatus } = {}) {
    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: OrderItem, as: 'items' },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    return { orders: rows, total: count };
  }

  async updateOrderStatus(orderId, { status, paymentStatus, paymentReference }) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (paymentReference) updates.paymentReference = paymentReference;
    if (status === 'shipped' && !order.shippedAt) updates.shippedAt = new Date();
    if (status === 'delivered' && !order.deliveredAt) updates.deliveredAt = new Date();
    return order.update(updates);
  }

  async getCategories() {
    return Category.findAll({ order: [['sortOrder', 'ASC'], ['name', 'ASC']] });
  }

  async createCategory(data) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return Category.create(data);
  }

  async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
    return category.update(data);
  }

  async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
    await category.update({ isActive: false });
  }
}

module.exports = new AdminService();