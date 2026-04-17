import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

const SettingsMenu = ({ user, setUser, isDarkMode, setIsDarkMode, language, setLanguage, t }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  console.log(user)

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
            {isDarkMode ? t.settings.lightMode : t.settings.darkMode}
          </button>

          <div className="settings-language">
            <span>{t.settings.language}</span>
            <div className="language-switcher">
              <button
                type="button"
                className={`lang-btn ${language === 'hu' ? 'active' : ''}`}
                onClick={() => setLanguage('hu')}
              >
                HU
              </button>
              <button
                type="button"
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>

          {user && (
            <p className="logged-user">
              {t.settings.loggedInAs}: {user.data.name || user.data.email}
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
            {user ? t.settings.logout : t.settings.login}
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