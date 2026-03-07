import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const defaultImage = 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <div className="card product-card" style={styles.card}>
            <Link to={`/product/${product.id}`} style={styles.imgLink}>
                <img
                    src={product.image_url || defaultImage}
                    alt={product.name}
                    style={styles.image}
                    onError={(e) => { e.target.src = defaultImage; }}
                />
            </Link>

            <div style={styles.body}>
                <div style={styles.categoryBadge}>
                    {product.category?.name || 'Vintage'}
                </div>

                <Link to={`/product/${product.id}`} style={styles.titleLink}>
                    <h3 style={styles.title}>{product.name}</h3>
                </Link>

                <div style={styles.sub}>
                    Size {product.stock > 0 ? 'Available' : 'Sold Out'} · PreLoud
                </div>

                <div style={styles.footer}>
                    <div>
                        <span style={styles.price}>₹{parseFloat(product.price).toFixed(2)}</span>
                    </div>
                    <button style={styles.heart}>♡</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '4px',
        border: '1px solid #eee',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    imgLink: {
        display: 'block',
        width: '100%',
        paddingBottom: '133%', /* 3:4 aspect ratio */
        position: 'relative',
        backgroundColor: '#f5f0eb',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    body: {
        padding: '10px 12px 12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    categoryBadge: {
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--secondary)',
        marginBottom: '3px',
    },
    titleLink: {
        display: 'block',
        textDecoration: 'none',
        marginBottom: '2px',
    },
    title: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '17px',
        color: 'var(--text-main)',
        margin: 0,
        fontWeight: '600',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    sub: {
        fontSize: '11px',
        color: 'var(--text-muted)',
        marginBottom: '8px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    price: {
        fontSize: '14px',
        fontWeight: '700',
        color: 'var(--primary)',
    },
    heart: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#ddd',
        transition: 'color 0.2s',
    }
};

export default ProductCard;
