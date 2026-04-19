import { useState } from 'react';
import { Link } from 'react-router';

const Header = ({ user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
  };
  return (
    <nav className="navbar">
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        TABLE<span style={{ fontWeight: '300', color: 'var(--text-main)' }}>WISE</span>
      </Link>

      <div className="nav-actions">
        <span
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-bars"></i>
        </span>
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Menu
        </Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>
        {user && (user.data.role === 'admin' || user.data.role === 'manager') && (
          <Link to="/users" onClick={() => setMenuOpen(false)}>
            Users
          </Link>
        )}
        {user && (
          <Link to="/work-schedule" onClick={() => setMenuOpen(false)}>
            Work Schedule
          </Link>
        )}
        {user && (user.data.role === 'admin' || user.data.role === 'manager') && (
          <Link to="/admin/meals" onClick={() => setMenuOpen(false)}>
            Manage meals
          </Link>
        )}
        {user && (user.data.role === 'admin' || user.data.role === 'manager') && (
          <Link to="/admin/work-schedule" onClick={() => setMenuOpen(false)}>
            Manage Schedules
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;