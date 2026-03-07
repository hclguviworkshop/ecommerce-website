import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Package, Calendar, DollarSign } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="animate-fade-in" style={styles.container}>
            <div style={styles.profileHeader}>
                <div style={styles.avatarRow}>
                    <div style={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={styles.userName}>{user.name}</h1>
                        <p style={styles.userEmail}>{user.email}</p>
                        <div style={styles.roleBadge}>{user.role}</div>
                    </div>
                </div>
            </div>

            <h2 style={styles.sectionTitle}>Order History</h2>

            {loading ? (
                <div style={styles.centerBox}>Loading orders...</div>
            ) : error ? (
                <div style={styles.errorBox}>{error}</div>
            ) : orders.length === 0 ? (
                <div style={styles.emptyState}>
                    <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3>No Orders Yet</h3>
                    <p style={{ color: 'var(--text-muted)' }}>When you place an order, it will appear here.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div style={styles.ordersList}>
                    {orders.map((order) => (
                        <div key={order.id} className="card" style={styles.orderCard}>
                            <div style={styles.orderHeader}>
                                <div>
                                    <div style={styles.orderId}>Order #{order.id}</div>
                                    <div style={styles.orderMetadata}>
                                        <span style={styles.metaItem}><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span style={styles.metaItem}><DollarSign size={14} /> {parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div style={styles.statusBadge(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
                            </div>

                            <div style={styles.orderItems}>
                                {order.items.map((item) => (
                                    <div key={item.id} style={styles.orderItem}>
                                        <img
                                            src={item.product?.image_url || 'https://via.placeholder.com/40'}
                                            alt={item.product?.name || 'Product'}
                                            style={styles.itemImage}
                                        />
                                        <div style={styles.itemInfo}>
                                            <div style={styles.itemName}>{item.product?.name || 'Deleted Product'}</div>
                                            <div style={styles.itemDetails}>
                                                Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
    },
    profileHeader: {
        backgroundColor: 'var(--surface)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
    },
    avatarRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        fontWeight: '700',
    },
    userName: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        margin: 0,
    },
    userEmail: {
        color: 'var(--text-muted)',
        marginBottom: '0.5rem',
    },
    roleBadge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        backgroundColor: '#EEF2FF',
        color: 'var(--primary)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginTop: '1rem',
    },
    emptyState: {
        backgroundColor: 'var(--surface)',
        padding: '4rem 2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    orderCard: {
        padding: '1.5rem',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem',
        marginBottom: '1rem',
    },
    orderId: {
        fontSize: '1.125rem',
        fontWeight: '700',
        marginBottom: '0.25rem',
    },
    orderMetadata: {
        display: 'flex',
        gap: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },
    statusBadge: (status) => {
        let bg = '#F3F4F6';
        let color = '#374151';

        if (status === 'delivered') { bg = '#D1FAE5'; color = '#065F46'; }
        if (status === 'shipped') { bg = '#DBEAFE'; color = '#1E40AF'; }
        if (status === 'processing') { bg = '#FEF3C7'; color = '#92400E'; }
        if (status === 'cancelled') { bg = '#FEE2E2'; color = '#991B1B'; }

        return {
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: '600',
            backgroundColor: bg,
            color: color,
        };
    },
    orderItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    orderItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    itemImage: {
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-sm)',
        objectFit: 'cover',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontWeight: '500',
    },
    itemDetails: {
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
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
    }
};

export default ProfilePage;
