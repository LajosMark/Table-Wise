import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

const SettingsMenu = ({ user, setUser, isDarkMode, setIsDarkMode }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  return (
    <div className="settings-container" ref={menuRef}>
      {showMenu && (
        <div className="settings-popup">
          <button onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {user && (
            <p className="logged-user">
              Logged in as: {user.data.name || user.data.email}
            </p>
          )}

          <hr className="divider" />
          <button
            className="login-btn"
            type="button"
            onClick={() => {
              if (user) {
                setUser(null);
                localStorage.removeItem('user');
                navigate('/');
              } else {
                navigate('/login');
              }
            }}
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      )}
      <div
        className={`settings-icon ${showMenu ? 'active' : ''}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        ⚙️
      </div>
    </div>
  );
};

export default SettingsMenu;