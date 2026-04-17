import { useState } from 'react';
import { Link } from 'react-router';

const API_BASE = 'http://localhost:3000';

const Header = ({ t, user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
  };
  console.log(user)
  return (
    <nav className="navbar">
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        TABLE<span style={{ fontWeight: '300', color: 'var(--text-main)' }}>WISE</span>
      </Link>

      <div className="nav-actions">
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={t.header.openNav}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          {t.nav.menu}
        </Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>
          {t.nav.about}
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          {t.nav.contact}
        </Link>
        {user && (user.data.role === 'admin' || user.data.role === 'manager') && (
          <Link to="/users" onClick={() => setMenuOpen(false)}>
            {t.nav.users || 'Felhasználók'}
          </Link>
        )}
        {user && (
          <Link to="/work-schedule" onClick={() => setMenuOpen(false)}>
            {t.nav.workSchedule || 'Munka Beosztás'}
          </Link>
        )}
        {user && (user.data.role === 'admin' || user.data.role === 'manager') && (
          <Link to="/admin/meals" onClick={() => setMenuOpen(false)}>
            {t.nav.mealsManagement || 'Ételek kezelése'}
          </Link>
        )}
        {user && (user.data.role === 'admin' || user.data.role === 'manager') && (
          <Link to="/admin/work-schedule" onClick={() => setMenuOpen(false)}>
            {t.nav.adminWorkSchedule || 'Beosztások Kezelése'}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;