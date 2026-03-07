const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    'ecommerce',
    'postgres',
    'SXjzhFRpsTLteqloTfNCyaMzAPBmODru',
    {
        host: 'switchyard.proxy.rlwy.net',
        dialect: 'postgres',
        logging: false, // Set to console.log to see SQL queries
    }
);

module.exports = sequelize;
