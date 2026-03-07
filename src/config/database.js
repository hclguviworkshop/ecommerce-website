require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'bolt2521',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

module.exports = sequelize;
// Required for sequelize-cli
module.exports.development = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'bolt2521',
  database: process.env.DB_NAME || 'ecommerce_db',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
};