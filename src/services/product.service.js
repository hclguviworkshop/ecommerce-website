const { Op } = require('sequelize');
const { Product, Category } = require('../models');

class ProductService {
  async getAll({ page = 1, limit = 12, search, categoryId, minPrice, maxPrice, isFeatured, sortBy = 'createdAt', sortOrder = 'DESC' } = {}) {
    const where = { isActive: true };
    const offset = (page - 1) * limit;

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price[Op.gte] = minPrice;
      if (maxPrice !== undefined) where.price[Op.lte] = maxPrice;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    return { products: rows, total: count };
  }

  async getById(id) {
    const product = await Product.findOne({
      where: { id, isActive: true },
      include: [{ model: Category, as: 'category' }],
    });
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return product;
  }

  async getBySlug(slug) {
    const product = await Product.findOne({
      where: { slug, isActive: true },
      include: [{ model: Category, as: 'category' }],
    });
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return product;
  }

  async create(data) {
    data.slug = await this._uniqueSlug(data.name);
    return Product.create(data);
  }

  async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    if (data.name && data.name !== product.name) {
      data.slug = await this._uniqueSlug(data.name, id);
    }
    return product.update(data);
  }

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    await product.update({ isActive: false });
  }

  async _uniqueSlug(name, excludeId = null) {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = base;
    let n = 1;
    while (true) {
      const where = { slug };
      if (excludeId) where.id = { [Op.ne]: excludeId };
      const existing = await Product.findOne({ where });
      if (!existing) return slug;
      slug = `${base}-${n++}`;
    }
  }
}

module.exports = new ProductService();