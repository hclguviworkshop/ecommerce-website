import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
    const { cart, fetchCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchCart();
        }
    }, [user, navigate, fetchCart]);

    const placeOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post('/api/orders', {}, config);
            setOrderData(data.data);
            setSuccess(true);
            fetchCart(); // This will fetch the empty cart
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={styles.successContainer}>
                <CheckCircle size={64} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
                <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Thank you for your purchase. Your order #{orderData?.id} is being processed.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                        View My Orders
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => acc + item.quantity * (item.product?.price || 0), 0);

    if (!cart || items.length === 0) {
        return (
            <div style={styles.centerBox}>
                <h3>Your cart is empty</h3>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
                    Go Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={styles.container}>
            <h1 style={styles.pageTitle}>Checkout</h1>

            {error && (
                <div style={styles.errorBox}>{error}</div>
            )}

            <div style={styles.layout}>
                {/* Mock form for shipping/payment to look authentic */}
                <div style={styles.formSection}>
                    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h2 style={styles.sectionTitle}>Shipping Address</h2>
                        <div style={styles.formRow}>
                            <div style={styles.inputGroup}>
                                <label>First Name</label>
                                <input type="text" readOnly value={user?.name.split(' ')[0] || ''} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Last Name</label>
                                <input type="text" readOnly value={user?.name.split(' ')[1] || ''} />
                            </div>
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Address</label>
                            <input type="text" defaultValue="123 Example Street" />
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.inputGroup}>
                                <label>City</label>
                                <input type="text" defaultValue="New York" />
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Postal Code</label>
                                <input type="text" defaultValue="10001" />
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem' }}>
                        <h2 style={styles.sectionTitle}>Payment Method</h2>
                        <div style={{ padding: '1rem', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', backgroundColor: '#F5F3FF', marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                <input type="radio" checked readOnly /> Credit Card (Demo)
                            </label>
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Card Number</label>
                            <input type="text" readOnly value="**** **** **** 4242" />
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div style={styles.summarySection}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={styles.summaryTitle}>Order Summary ({items.length} items)</h3>

                        <div style={styles.itemList}>
                            {items.map(item => (
                                <div key={item.id} style={styles.summaryItem}>
                                    <div style={{ flex: 1 }}>
                                        <div style={styles.itemName}>{item.product?.name || 'Deleted Product'}</div>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                                    </div>
                                    <div style={{ fontWeight: '600' }}>
                                        ₹{parseFloat(item.quantity * (item.product?.price || 0)).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

                        <div style={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Tax (8%)</span>
                            <span>₹{(subtotal * 0.08).toFixed(2)}</span>
                        </div>

                        <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                            <span>Total</span>
                            <span>₹{(subtotal * 1.08).toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                            onClick={placeOrder}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Pay ₹${(subtotal * 1.08).toFixed(2)}`}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                            This is a demo application. No real charges will be made.
                        </p>
                    </div>
                </div>
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
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '2rem',
        fontStyle: 'italic',
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.5fr) minmax(350px, 1fr)',
        gap: '2rem',
        alignItems: 'start',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
    },
    formRow: {
        display: 'flex',
        gap: '1rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1rem',
        flex: 1,
    },
    summarySection: {
        position: 'sticky',
        top: '5rem',
    },
    summaryTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
    },
    itemList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        color: 'var(--text-muted)',
    },
    summaryTotal: {
        color: 'var(--text-main)',
        fontSize: '1.5rem',
        fontWeight: '700',
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        marginBottom: '2rem',
    },
    errorBox: {
        backgroundColor: '#FEE2E2',
        color: 'var(--error)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
    },
    centerBox: {
        textAlign: 'center',
        padding: '4rem 0',
    },
    successContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        minHeight: '60vh',
    },
    successTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        marginBottom: '1rem',
    }
};

export default CheckoutPage;
