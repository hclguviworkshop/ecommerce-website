const { sequelize, Category, Product, User } = require('./models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB for seeding...');

        // Clear existing products and categories for the new theme
        await Product.destroy({ where: {} });
        await Category.destroy({ where: {} });

        // 1. Create Thrift Store Categories
        const vintageTees = await Category.create({ name: 'Vintage Tees', description: 'Classic graphic and band t-shirts from the 80s and 90s' });
        const denim = await Category.create({ name: 'Denim & Jeans', description: 'Pre-loved Levi\'s, Wrangler, and distressed denim' });
        const outerwear = await Category.create({ name: 'Outerwear', description: 'Retro windbreakers, leather jackets, and cozy sweaters' });
        const accessories = await Category.create({ name: 'Accessories', description: 'Hats, belts, and vintage bags' });

        // 2. Create Thrift Products (Unique items usually have stock of 1)
        await Product.bulkCreate([
            {
                name: 'Vintage 90s Harley Davidson Tee',
                description: 'Authentic faded black Harley Davidson t-shirt. Perfectly worn in, featuring a classic eagle graphic on the back. Size Large.',
                price: 3500.00,
                stock: 1, // Unique thrift item!
                category_id: vintageTees.id,
                image_url: '/images/vintage_harley_tee_1772876532032.png'
            },
            {
                name: 'Levi\'s 501 Original Fit Jeans',
                description: 'Classic medium wash Levi\'s 501s. Great vintage condition with slight distressing at the hem. Waist 32, Inseam 30.',
                price: 4500.00,
                stock: 1,
                category_id: denim.id,
                image_url: '/images/levis_501_jeans_1772876547190.png'
            },
            {
                name: 'Retro Colorblock Windbreaker',
                description: 'Bright 80s style neon colorblock windbreaker jacket. Lightweight and perfect for layering. Size Medium.',
                price: 3000.00,
                stock: 1,
                category_id: outerwear.id,
                image_url: '/images/retro_windbreaker_1772876568997.png'
            },
            {
                name: 'Oversized Cable Knit Sweater',
                description: 'Cozy cream-colored chunky knit sweater. Perfect oversized fit for the winter. Extremely soft wool blend.',
                price: 3200.00,
                stock: 1,
                category_id: outerwear.id,
                image_url: '/images/cable_knit_sweater_1772876583832.png'
            },
            {
                name: 'Y2K Sparkle Mini Bag',
                description: 'Iconic early 2000s style mini shoulder bag with silver hardware. Excellent condition.',
                price: 2200.00,
                stock: 1,
                category_id: accessories.id,
                image_url: '/images/y2k_sparkle_bag_1772876599884.png'
            },
            {
                name: 'Distressed Denim Jacket',
                description: 'Vintage oversized denim jacket with custom patches and natural distressing. A true one-of-a-kind piece. Size XL.',
                price: 5000.00,
                stock: 1,
                category_id: outerwear.id,
                image_url: '/images/distressed_denim_jacket_1772876620656.png'
            }
        ]);

        // 3. Ensure Admin Exists
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash('admin123', salt);

        const adminExists = await User.findOne({ where: { email: 'admin@thrift.com' } });
        if (!adminExists) {
            await User.create({
                name: 'Thrift Admin',
                email: 'admin@thrift.com',
                password_hash,
                role: 'admin'
            });
            console.log('Created admin account: admin@thrift.com / admin123');
        }

        console.log('Database seeded successfully with Thrift Store theme items!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        process.exit();
    }
}

seedDatabase();
