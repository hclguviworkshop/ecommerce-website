import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products'); // products, orders

    // Data
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);

    // Loading & Error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchData(activeTab);
    }, [user, navigate, activeTab]);

    const fetchData = async (tab) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            if (tab === 'products') {
                const [prodRes, catRes] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/categories')
                ]);
                setProducts(prodRes.data.data);
                setCategories(catRes.data.data);
            } else if (tab === 'orders') {
                const { data } = await axios.get('/api/orders', config);
                setOrders(data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/orders/${orderId}/status`, { status }, config);
            fetchData('orders'); // refresh
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                fetchData('products'); // refresh
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    // Very simplified Create Product logic for demo purposes
    const handleCreateProduct = async () => {
        const name = window.prompt("Enter product name:");
        if (!name) return;
        const price = window.prompt("Enter product price:");
        if (!price) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/products', {
                name,
                description: 'New product description',
                price: parseFloat(price),
                stock: 10,
                category_id: categories.length > 0 ? categories[0].id : null,
                image_url: `https://picsum.photos/seed/${Math.random()}/400/300`
            }, config);
            fetchData('products');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create product');
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="animate-fade-in" style={styles.container}>
            <h1 style={styles.pageTitle}>Admin Dashboard</h1>

            <div style={styles.tabs}>
                <button
                    style={activeTab === 'products' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('products')}
                >
                    Manage Products
                </button>
                <button
                    style={activeTab === 'orders' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('orders')}
                >
                    Manage Orders
                </button>
            </div>

            <div className="card" style={styles.content}>
                {error && <div style={styles.errorBox}>{error}</div>}

                {loading ? (
                    <div style={styles.centerBox}>Loading data...</div>
                ) : (
                    <>
                        {activeTab === 'products' && (
                            <div>
                                <div style={styles.adminActionHeader}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Products Inventory</h2>
                                    <button className="btn btn-primary" onClick={handleCreateProduct}>
                                        <Plus size={18} /> Add Product
                                    </button>
                                </div>

                                <div style={styles.tableResponsive}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>ID</th>
                                                <th style={styles.th}>Name</th>
                                                <th style={styles.th}>Price</th>
                                                <th style={styles.th}>Stock</th>
                                                <th style={styles.th}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product.id} style={styles.tr}>
                                                    <td style={styles.td}>{product.id}</td>
                                                    <td style={styles.td}>{product.name}</td>
                                                    <td style={styles.td}>₹{parseFloat(product.price).toFixed(2)}</td>
                                                    <td style={styles.td}>{product.stock}</td>
                                                    <td style={styles.td}>
                                                        <button
                                                            style={{ ...styles.actionBtn, color: 'var(--error)' }}
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <div style={styles.adminActionHeader}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Customer Orders</h2>
                                </div>

                                <div style={styles.tableResponsive}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Order ID</th>
                                                <th style={styles.th}>Customer</th>
                                                <th style={styles.th}>Total</th>
                                                <th style={styles.th}>Status</th>
                                                <th style={styles.th}>Update Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id} style={styles.tr}>
                                                    <td style={styles.td}>{order.id}</td>
                                                    <td style={styles.td}>User #{order.user_id}</td>
                                                    <td style={styles.td}>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                                    <td style={styles.td}>
                                                        <span style={styles.statusBadge(order.status)}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                            style={{ padding: '0.25rem', borderRadius: '4px' }}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    pageTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--text-main)',
    },
    tabs: {
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem',
    },
    tab: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        fontWeight: '500',
        color: 'var(--text-muted)',
        borderBottom: '2px solid transparent',
    },
    activeTab: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--primary)',
        borderBottom: '2px solid var(--primary)',
    },
    content: {
        padding: '2rem',
    },
    adminActionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    tableResponsive: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid var(--border)',
        fontWeight: '600',
        color: 'var(--text-muted)',
    },
    tr: {
        borderBottom: '1px solid var(--border)',
    },
    td: {
        padding: '1rem',
        verticalAlign: 'middle',
    },
    actionBtn: {
        padding: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-sm)',
    },
    statusBadge: (status) => {
        let bg = '#F3F4F6';
        let color = '#374151';

        if (status === 'delivered') { bg = '#D1FAE5'; color = '#065F46'; }
        if (status === 'shipped') { bg = '#DBEAFE'; color = '#1E40AF'; }
        if (status === 'processing') { bg = '#FEF3C7'; color = '#92400E'; }
        if (status === 'cancelled') { bg = '#FEE2E2'; color = '#991B1B'; }

        return {
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: bg,
            color: color,
            textTransform: 'uppercase',
        };
    },
    centerBox: {
        textAlign: 'center',
        padding: '4rem 0',
    },
    errorBox: {
        backgroundColor: '#FEE2E2',
        color: 'var(--error)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
    }
};

export default AdminDashboard;
