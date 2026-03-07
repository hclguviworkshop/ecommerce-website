const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const RefreshToken = require('./RefreshToken');

// ── Associations ────────────────────────────────────────────────

// User
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });

// Cart
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

// CartItem
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Category
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

// Product
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

// Order
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

// OrderItem
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// RefreshToken
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Cart,
  CartItem,
  Order,
  OrderItem,
  RefreshToken,
};