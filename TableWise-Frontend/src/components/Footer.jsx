const Footer = () => (
  <footer className="main-footer">
    <div className="footer-content">
      <h3 className="logo" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>TableWise</h3>
      <p>&copy; {new Date().getFullYear()} - All rights reserved</p>
      <div className="footer-divider" style={{ 
        width: '50px', 
        height: '2px', 
        background: 'var(--accent-gold)', 
        margin: '1.5rem auto' 
      }}></div>
      <p className="footer-text">
        Opening: <br />
        <span>Monday - Thursday: 10:00 - 22:00</span><br/>
        <span>Friday - Saturday: 10:00 - 00:00</span><br/>
        <span>Sunday: 12:00 - 20:00</span><br/>
      
      </p>
    </div>
  </footer>
);
export default Footer;