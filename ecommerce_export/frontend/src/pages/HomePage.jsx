import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/categories'),
                ]);
                setProducts(productsRes.data.data);
                setCategories(categoriesRes.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
                setLoading(false);
            }
        };
        fetchProductsAndCategories();
    }, []);

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category_id === parseInt(selectedCategory) : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="animate-fade-in" style={styles.container}>
            <section style={styles.hero}>
                <h1 style={styles.heroTitle}>Curated Vintage & Pre-Loved Fashion</h1>
                <p style={styles.heroSubtitle}>Discover unique pieces and give clothes a second life.</p>

                <div style={styles.searchContainer}>
                    <div style={styles.searchInputWrapper}>
                        <Search size={20} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>
                    <div style={styles.filters}>
                        <button
                            style={selectedCategory === '' ? { ...styles.chip, ...styles.chipActive } : styles.chip}
                            onClick={() => setSelectedCategory('')}
                        >
                            All Categories
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                style={selectedCategory === String(cat.id) ? { ...styles.chip, ...styles.chipActive } : styles.chip}
                                onClick={() => setSelectedCategory(String(cat.id))}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {loading ? (
                <div style={styles.centerBox}><h3>Loading products...</h3></div>
            ) : error ? (
                <div style={styles.errorBox}>{error}</div>
            ) : (
                <div style={styles.productGrid}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div style={styles.centerBox}>
                            <h3>No products found matching your criteria.</h3>
                        </div>
                    )}
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
    hero: {
        backgroundColor: 'var(--surface)',
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        marginBottom: '1rem',
    },
    heroTitle: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '3rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '1rem',
        fontStyle: 'italic',
    },
    heroSubtitle: {
        fontSize: '1.125rem',
        color: 'var(--text-muted)',
        marginBottom: '2rem',
        maxWidth: '600px',
        margin: '0 auto 2rem',
    },
    searchContainer: {
        display: 'flex',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto',
        flexDirection: 'row',
    },
    searchInputWrapper: {
        position: 'relative',
        flex: 2,
    },
    searchIcon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
    },
    searchInput: {
        paddingLeft: '3rem',
    },
    filters: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    chip: {
        padding: '5px 15px',
        borderRadius: '20px',
        border: '1.5px solid #ddd',
        background: '#fff',
        fontFamily: "'Nunito', sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    chipActive: {
        background: 'var(--primary)',
        color: '#fff',
        borderColor: 'var(--primary)',
    },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '18px',
    },
    centerBox: {
        textAlign: 'center',
        padding: '4rem 0',
        gridColumn: '1 / -1',
        color: 'var(--text-muted)',
    },
    errorBox: {
        backgroundColor: '#FEE2E2',
        color: 'var(--error)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        gridColumn: '1 / -1',
    }
};

export default HomePage;
