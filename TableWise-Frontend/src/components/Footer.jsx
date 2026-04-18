const Footer = () => (
  <footer className="main-footer">
    <div className="footer-content">
      <h3 className="logo" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>TableWise</h3>
      <p>&copy; {new Date().getFullYear()} - Modern Culinary Experience</p>
      <div className="footer-divider" style={{ 
        width: '50px', 
        height: '2px', 
        background: 'var(--accent-gold)', 
        margin: '1.5rem auto' 
      }}></div>
      <p className="footer-text">Opening hours: Monday - Sunday: 12:00 - 22:00</p>
    </div>
  </footer>
);
export default Footer;