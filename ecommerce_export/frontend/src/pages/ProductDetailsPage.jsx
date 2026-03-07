import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { ShoppingCart, ArrowLeft, Check, AlertCircle } from 'lucide-react';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [added, setAdded] = useState(false);

    const { addToCart } = useCartStore();
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch product');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        await addToCart(product.id, quantity);
        setAddingToCart(false);
        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 3000);
    };

    if (loading) return <div style={styles.centerBox}><h3>Loading item details...</h3></div>;
    if (error) return <div style={styles.errorBox}>{error}</div>;
    if (!product) return <div style={styles.centerBox}><h3>Product not found</h3></div>;

    const defaultImage = 'https://via.placeholder.com/600x600?text=No+Image';

    return (
        <div className="animate-fade-in" style={styles.container}>
            <Link to="/" style={styles.backLink}>
                <ArrowLeft size={20} />
                Back to Products
            </Link>

            <div style={styles.content}>
                <div style={styles.imageSection}>
                    <img
                        src={product.image_url || defaultImage}
                        alt={product.name}
                        style={styles.image}
                        onError={(e) => { e.target.src = defaultImage; }}
                    />
                </div>

                <div style={styles.infoSection}>
                    <div style={styles.categoryBadge}>{product.category?.name || 'General'}</div>
                    <h1 style={styles.title}>{product.name}</h1>

                    <div style={styles.priceSection}>
                        <span style={styles.price}>₹{parseFloat(product.price).toFixed(2)}</span>
                        {product.stock > 0 ? (
                            <span style={styles.inStock}>In Stock ({product.stock} available)</span>
                        ) : (
                            <span style={styles.outOfStock}>Out of Stock</span>
                        )}
                    </div>

                    <div style={styles.description}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Product Description</h3>
                        <p style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>{product.description}</p>
                    </div>

                    <div style={styles.actionSection}>
                        {product.stock > 0 ? (
                            <>
                                <div style={styles.quantityWrapper}>
                                    <label htmlFor="quantity" style={{ fontWeight: 500 }}>Quantity:</label>
                                    <select
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        style={styles.quantitySelect}
                                    >
                                        {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={styles.cartBtn}
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    {addingToCart ? (
                                        'Adding...'
                                    ) : added ? (
                                        <><Check size={20} /> Added to Cart</>
                                    ) : (
                                        <><ShoppingCart size={20} /> Add to Cart</>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div style={styles.outOfStockNotice}>
                                <AlertCircle size={20} />
                                This product is currently unavailable.
                            </div>
                        )}
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
    backLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-muted)',
        fontWeight: '500',
        width: 'fit-content',
        padding: '0.5rem 0',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '4rem',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
    },
    imageSection: {
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: '#f5f0eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #eee',
        aspectRatio: '3/4',
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
    },
    infoSection: {
        display: 'flex',
        flexDirection: 'column',
    },
    categoryBadge: {
        display: 'inline-block',
        backgroundColor: '#f0faf5',
        color: 'var(--primary)',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '10px',
        padding: '4px 12px',
        borderRadius: '20px',
        marginBottom: '12px',
        width: 'fit-content',
    },
    title: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '30px',
        color: 'var(--text-main)',
        lineHeight: 1.2,
        marginBottom: '4px',
        fontWeight: '400',
    },
    priceSection: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '10px',
        marginBottom: '18px',
        paddingBottom: '14px',
        borderBottom: '1px solid #f0f0f0',
    },
    price: {
        fontSize: '26px',
        fontWeight: '700',
        color: 'var(--primary)',
    },
    inStock: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.875rem',
        fontWeight: '600',
    },
    outOfStock: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.875rem',
        fontWeight: '600',
    },
    description: {
        marginBottom: '2rem',
    },
    actionSection: {
        marginTop: 'auto',
        backgroundColor: '#F9FAFB',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
    },
    quantityWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
    },
    quantitySelect: {
        width: '100px',
    },
    cartBtn: {
        width: '100%',
        padding: '1rem',
        fontSize: '1.125rem',
    },
    outOfStockNotice: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--error)',
        fontWeight: '500',
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
        textAlign: 'center',
    }
};

export default ProductDetailsPage;
