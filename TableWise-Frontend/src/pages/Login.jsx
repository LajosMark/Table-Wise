import { useState } from 'react';
import { useNavigate } from 'react-router';

const API_BASE = 'https://table-wise-backend-for-render-hosting-1.onrender.com';

const Login = ({ setUser }) => {
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
        throw new Error(data.message || 'Login failed');
      }

      const token = data.token || data.user?.token || '';
      if (!token) {
        throw new Error('No token returned in response');
      }

      // Fetch user details from the /me endpoint
      const meResponse = await fetch(`${API_BASE}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const meData = await meResponse.json();

      if (!meResponse.ok) {
        throw new Error(meData.message || 'Error fetching user data');
      }

      const userObject = {
        ...meData,
        token: token,
      };

      localStorage.setItem('user', JSON.stringify(userObject));
      setUser(userObject);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container auth-page" data-cy="login-page">
      <h1 data-cy="login-title">Login</h1>
      <p className="auth-intro" data-cy="login-intro">Please enter your credentials to access your account.</p>

      <form className="auth-form" onSubmit={handleSubmit} data-cy="login-form">
        {error && <div className="auth-error" data-cy="login-error">{error}</div>}

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          data-cy="login-email-input"
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          data-cy="login-password-input"
        />

        <button type="submit" disabled={loading} data-cy="login-submit-btn">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </section>
  );
};

export default Login;
