const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CartItem extends Model {}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'carts', key: 'id' },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    priceAtAdd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      // Snapshot of price at time of adding to cart
    },
  },
    {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cart_items',
    }
);

module.exports = CartItem;