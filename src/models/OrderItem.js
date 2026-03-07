const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true, // keep record even if product deleted
      references: { model: 'products', key: 'id' },
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false, // snapshot
    },
    productSku: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
  }
);

module.exports = OrderItem;