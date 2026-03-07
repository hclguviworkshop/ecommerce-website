const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    comparePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: { min: 0 },
    },
    costPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      // Array of { url, alt, isPrimary }
    },
    attributes: {
      type: DataTypes.JSONB,
      defaultValue: {},
      // e.g. { color: 'red', size: 'M', weight: '200g' }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
    }
);

module.exports = Product;