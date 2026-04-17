import { useState } from 'react';
import { useNavigate } from 'react-router';

const API_BASE = 'http://localhost:3000';

const Login = ({ t, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.login.error);
      }

      const token = data.token || data.user?.token || '';
      if (!token) {
        throw new Error('Nincs token a válaszban');
      }

      // Lekérjük a felhasználói adatokat a /me endpoint-tel
      const meResponse = await fetch(`${API_BASE}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const meData = await meResponse.json();

      if (!meResponse.ok) {
        throw new Error(meData.message || 'Hiba a felhasználói adatok lekérésénél');
      }

      const userObject = {
        ...meData,
        token: token,
      };

      localStorage.setItem('user', JSON.stringify(userObject));
      setUser(userObject);
      navigate('/');
    } catch (err) {
      setError(err.message || t.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container auth-page">
      <h1>{t.login.title}</h1>
      <p className="auth-intro">{t.login.intro}</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <label htmlFor="login-email">{t.login.email}</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.login.emailPlaceholder}
          required
        />

        <label htmlFor="login-password">{t.login.password}</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.login.passwordPlaceholder}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? t.login.loading : t.login.submit}
        </button>
      </form>
    </section>
  );
};

export default Login;
