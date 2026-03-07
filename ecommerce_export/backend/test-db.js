const { sequelize, User, Product } = require('./models');

async function checkDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Check tables
        const users = await User.count();
        const products = await Product.count();

        console.log(`Found ${users} users and ${products} products.`);
        console.log('Tables exist and are accessible.');
    } catch (error) {
        console.error('Unable to connect to the database or query tables:', error);
    } finally {
        process.exit();
    }
}

checkDb();
