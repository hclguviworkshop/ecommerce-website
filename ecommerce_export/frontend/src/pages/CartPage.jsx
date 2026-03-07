import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { Trash2, ArrowRight } from 'lucide-react';

const CartPage = () => {
    const { cart, loading, fetchCart, updateQuantity, removeFromCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            navigate('/login');
        }
    }, [user, navigate, fetchCart]);

    if (loading && !cart) {
        return <div style={styles.centerBox}><h3>Loading cart...</h3></div>;
    }

    const items = cart?.items || [];
    const isEmpty = items.length === 0;

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + item.quantity * (item.product?.price || 0), 0);
    };

    return (
        <div className="animate-fade-in" style={styles.container}>
            <h1 style={styles.pageTitle}>Your Shopping Cart</h1>

            {isEmpty ? (
                <div style={styles.emptyCart}>
                    <div style={styles.emptyIcon}>🛍️</div>
                    <h2>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div style={styles.cartLayout}>
                    <div style={styles.cartItems}>
                        <div style={styles.tableHeader}>
                            <div style={styles.colProduct}>Product</div>
                            <div style={styles.colPrice}>Price</div>
                            <div style={styles.colQuantity}>Quantity</div>
                            <div style={styles.colTotal}>Total</div>
                            <div style={styles.colAction}></div>
                        </div>

                        {items.map((item) => (
                            <div key={item.id} style={styles.cartRow}>
                                <div style={styles.colProduct}>
                                    <img
                                        src={item.product?.image_url || 'https://via.placeholder.com/80'}
                                        alt={item.product?.name || 'Deleted Product'}
                                        style={styles.productImage}
                                    />
                                    <div>
                                        <Link to={`/product/${item.product_id}`} style={styles.productName}>
                                            {item.product?.name || 'Item no longer available'}
                                        </Link>
                                    </div>
                                </div>
                                <div style={styles.colPrice}>
                                    ₹{parseFloat(item.product?.price || 0).toFixed(2)}
                                </div>
                                <div style={styles.colQuantity}>
                                    <select
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                        style={styles.select}
                                    >
                                        {[...Array(Math.min(item.product?.stock || 0, 10)).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.colTotal}>
                                    ₹{parseFloat(item.quantity * (item.product?.price || 0)).toFixed(2)}
                                </div>
                                <div style={{ ...styles.colAction, textAlign: 'right' }}>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={styles.removeBtn}
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.cartSummary}>
                        <h3 style={styles.summaryTitle}>Order Summary</h3>

                        <div style={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Tax</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                            <span>Estimated Total</span>
                            <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>

                        <Link to="/checkout" style={{ display: 'block', width: '100%' }}>
                            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                Proceed to Checkout <ArrowRight size={20} />
                            </button>
                        </Link>
                    </div>
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
    },
    pageTitle: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        fontStyle: 'italic',
    },
    emptyCart: {
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    cartLayout: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
        gap: '2rem',
        alignItems: 'start',
    },
    cartItems: {
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
    },
    tableHeader: {
        display: 'flex',
        padding: '1rem 1.5rem',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid var(--border)',
        fontWeight: '600',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
    },
    cartRow: {
        display: 'flex',
        padding: '1.5rem',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
    },
    colProduct: { flex: 2, display: 'flex', gap: '1rem', alignItems: 'center' },
    colPrice: { flex: 1, fontWeight: '500' },
    colQuantity: { flex: 1 },
    colTotal: { flex: 1, fontWeight: '700' },
    colAction: { flex: '0 0 50px' },
    productImage: {
        width: '64px',
        height: '64px',
        objectFit: 'cover',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
    },
    productName: {
        fontWeight: '600',
        color: 'var(--text-main)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    select: {
        width: '70px',
        padding: '0.5rem',
    },
    removeBtn: {
        color: 'var(--error)',
        padding: '0.5rem',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartSummary: {
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
    },
    summaryTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border)',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        color: 'var(--text-muted)',
    },
    summaryTotal: {
        color: 'var(--text-main)',
        fontSize: '1.25rem',
        fontWeight: '700',
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        marginBottom: '2rem',
    },
    centerBox: {
        textAlign: 'center',
        padding: '4rem 0',
    }
};

// Add responsive adjustments for smaller screens later if needed using standard CSS media queries in index.css
export default CartPage;
