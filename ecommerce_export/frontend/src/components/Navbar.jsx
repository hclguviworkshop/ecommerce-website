import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Package } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { cart } = useCartStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <header className="navbar" style={styles.header}>
            <div className="nav-container" style={styles.container}>
                <Link to="/" style={styles.brand}>
                    <Package className="brand-icon" style={{ color: 'var(--primary)' }} />
                    <span style={styles.brandText}>Thrift Haven</span>
                </Link>

                <nav style={styles.navLinks}>
                    <Link to="/" style={styles.link}>Shop Vintage</Link>

                    <Link to="/cart" style={styles.iconLink}>
                        <ShoppingCart size={20} />
                        {cartItemCount > 0 && (
                            <span style={styles.badge}>{cartItemCount}</span>
                        )}
                    </Link>

                    {user ? (
                        <div style={styles.userMenu}>
                            <Link to="/profile" style={styles.iconLink}>
                                <UserIcon size={20} />
                                <span className="user-name" style={{ marginLeft: '0.25rem', fontSize: '0.875rem' }}>{user.name}</span>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" style={styles.link}>Admin</Link>
                            )}
                            <button onClick={handleLogout} style={styles.iconLink}>
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div style={styles.authLinks}>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: 'var(--surface)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 48px',
        height: '60px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    brandText: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        fontStyle: 'italic',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    link: {
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        transition: 'color 0.2s',
    },
    iconLink: {
        display: 'flex',
        alignItems: 'center',
        color: 'var(--text-muted)',
        position: 'relative',
        transition: 'color 0.2s',
    },
    badge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        minWidth: '18px',
        height: '18px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
    },
    userMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        borderLeft: '1px solid var(--border)',
        paddingLeft: '1.5rem',
    },
    authLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    }
};

export default Navbar;
