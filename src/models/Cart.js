const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
  }
);

module.exports = Cart;