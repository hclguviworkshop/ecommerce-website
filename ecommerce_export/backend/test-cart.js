const axios = require('axios');

async function testCart() {
    try {
        // 1. Login
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@thrift.com',
            password: 'admin123'
        });

        const token = loginRes.data.data.token;
        console.log('Logged in successfully', token ? 'Token received' : 'No token');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Fetch products to get an ID
        const productsRes = await axios.get('http://localhost:5000/api/products');
        const productId = productsRes.data.data[0].id;
        console.log('Found product ID:', productId);

        // 3. Add to cart
        console.log('Adding to cart...');
        const addRes = await axios.post('http://localhost:5000/api/cart', {
            product_id: productId,
            quantity: 1
        }, config);
        console.log('Add to cart response:', addRes.status, addRes.data);

        // 4. View cart
        console.log('Fetching cart...');
        const cartRes = await axios.get('http://localhost:5000/api/cart', config);
        console.log('Cart fetch response:', cartRes.status, JSON.stringify(cartRes.data, null, 2));

    } catch (err) {
        if (err.response) {
            console.error('API Error:', err.response.status, err.response.data);
        } else {
            console.error('Error:', err.message);
        }
    }
}

testCart();
