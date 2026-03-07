'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const adminId = uuidv4();
    const customerId = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@shop.com',
        password: await bcrypt.hash('Admin1234!', 12),
        role: 'admin',
        is_verified: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: customerId,
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: await bcrypt.hash('Password1!', 12),
        role: 'customer',
        is_verified: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    const electronicsId = uuidv4();
    const clothingId = uuidv4();

    await queryInterface.bulkInsert('categories', [
      { id: electronicsId, name: 'Electronics', slug: 'electronics', is_active: true, sort_order: 1, created_at: now, updated_at: now },
      { id: clothingId, name: 'Clothing', slug: 'clothing', is_active: true, sort_order: 2, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('products', [
      {
        id: uuidv4(),
        name: 'Wireless Headphones Pro',
        slug: 'wireless-headphones-pro',
        description: 'Premium noise-cancelling wireless headphones.',
        price: 129.99,
        compare_price: 179.99,
        stock: 50,
        sku: 'WHP-001',
        images: JSON.stringify([{ url: 'https://picsum.photos/seed/headphones/400/300', alt: 'Headphones', isPrimary: true }]),
        tags: '{audio,wireless}',
        category_id: electronicsId,
        is_active: true,
        is_featured: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Smart Watch Series X',
        slug: 'smart-watch-series-x',
        description: 'Feature-packed smartwatch with health monitoring.',
        price: 249.99,
        stock: 30,
        sku: 'SWX-001',
        images: JSON.stringify([{ url: 'https://picsum.photos/seed/watch/400/300', alt: 'Smart Watch', isPrimary: true }]),
        tags: '{wearable,smart}',
        category_id: electronicsId,
        is_active: true,
        is_featured: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-t-shirt',
        description: 'Soft 100% organic cotton t-shirt.',
        price: 24.99,
        stock: 200,
        sku: 'TSH-001',
        images: JSON.stringify([{ url: 'https://picsum.photos/seed/tshirt/400/300', alt: 'T-Shirt', isPrimary: true }]),
        tags: '{clothing,cotton}',
        attributes: JSON.stringify({ material: '100% Cotton', sizes: ['S', 'M', 'L', 'XL'] }),
        category_id: clothingId,
        is_active: true,
        is_featured: false,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};