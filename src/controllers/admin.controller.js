const adminService = require('../services/admin.service');
const productService = require('../services/product.service');
const { sendSuccess, paginationMeta } = require('../utils/response');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      sendSuccess(res, { data: stats });
    } catch (err) {
      next(err);
    }
  }

  // ── Users ──────────────────────────────────────────────────────
  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 20, search, role } = req.query;
      const { users, total } = await adminService.getUsers({ page, limit, search, role });
      sendSuccess(res, { data: { users }, meta: paginationMeta({ total, page, limit }) });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await adminService.updateUserStatus(req.params.id, req.body);
      sendSuccess(res, { message: 'User updated', data: { user } });
    } catch (err) {
      next(err);
    }
  }

  // ── Orders ─────────────────────────────────────────────────────
  async getOrders(req, res, next) {
    try {
      const { page = 1, limit = 20, status, paymentStatus } = req.query;
      const { orders, total } = await adminService.getAllOrders({ page, limit, status, paymentStatus });
      sendSuccess(res, { data: { orders }, meta: paginationMeta({ total, page, limit }) });
    } catch (err) {
      next(err);
    }
  }

  async updateOrder(req, res, next) {
    try {
      const order = await adminService.updateOrderStatus(req.params.id, req.body);
      sendSuccess(res, { message: 'Order updated', data: { order } });
    } catch (err) {
      next(err);
    }
  }

  // ── Products ───────────────────────────────────────────────────
  async createProduct(req, res, next) {
    try {
      const product = await productService.create(req.body);
      sendSuccess(res, { statusCode: 201, message: 'Product created', data: { product } });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      sendSuccess(res, { message: 'Product updated', data: { product } });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.delete(req.params.id);
      sendSuccess(res, { message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  }

  // ── Categories ─────────────────────────────────────────────────
  async getCategories(req, res, next) {
    try {
      const categories = await adminService.getCategories();
      sendSuccess(res, { data: { categories } });
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req, res, next) {
    try {
      const category = await adminService.createCategory(req.body);
      sendSuccess(res, { statusCode: 201, message: 'Category created', data: { category } });
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await adminService.updateCategory(req.params.id, req.body);
      sendSuccess(res, { message: 'Category updated', data: { category } });
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      await adminService.deleteCategory(req.params.id);
      sendSuccess(res, { message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();