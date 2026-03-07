const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <p>&copy; {new Date().getFullYear()} Thrift Haven. Curated vintage finds.</p>
                <p style={styles.subText}>Built with React, Node.js, Express & MySQL</p>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        padding: '2rem 1rem',
        textAlign: 'center',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    subText: {
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        marginTop: '0.5rem',
    }
};

export default Footer;
