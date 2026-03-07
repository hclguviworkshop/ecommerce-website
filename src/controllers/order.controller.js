const orderService = require('../services/order.service');
const { sendSuccess, paginationMeta } = require('../utils/response');

class OrderController {
  async create(req, res, next) {
    try {
      const order = await orderService.create(req.user.id, req.body);
      sendSuccess(res, { statusCode: 201, message: 'Order placed successfully', data: { order } });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const { orders, total } = await orderService.getAll(req.user.id, { page, limit, status });
      sendSuccess(res, {
        data: { orders },
        meta: paginationMeta({ total, page, limit }),
      });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id, req.user.id);
      sendSuccess(res, { data: { order } });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const order = await orderService.cancel(req.params.id, req.user.id);
      sendSuccess(res, { message: 'Order cancelled', data: { order } });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();