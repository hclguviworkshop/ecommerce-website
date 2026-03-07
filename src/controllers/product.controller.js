const productService = require('../services/product.service');
const { sendSuccess, paginationMeta } = require('../utils/response');

class ProductController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 12, ...filters } = req.query;
      const { products, total } = await productService.getAll({ page, limit, ...filters });
      sendSuccess(res, {
        data: { products },
        meta: paginationMeta({ total, page, limit }),
      });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      sendSuccess(res, { data: { product } });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      sendSuccess(res, { data: { product } });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      sendSuccess(res, { statusCode: 201, message: 'Product created', data: { product } });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      sendSuccess(res, { message: 'Product updated', data: { product } });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await productService.delete(req.params.id);
      sendSuccess(res, { message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();