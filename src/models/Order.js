const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    shippingAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
      // { firstName, lastName, street, city, state, zipCode, country, phone }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    hooks: {
      beforeCreate: (order) => {
        if (!order.orderNumber) {
          const timestamp = Date.now().toString(36).toUpperCase();
          const random = Math.random().toString(36).substring(2, 6).toUpperCase();
          order.orderNumber = `ORD-${timestamp}-${random}`;
        }
      },
    },
  }
);

module.exports = Order;