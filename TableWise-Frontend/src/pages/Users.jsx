import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3000';

const Users = ({ t, user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  useEffect(() => {
    if (!user || !user.token) {
      setError('Nincs jogosultságod a felhasználók megtekintéséhez.');
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Hiba a felhasználók lekérésénél');
      }

      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Ismeretlen hiba');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm(t.users?.confirmDelete || 'Biztosan törölni szeretnéd ezt a felhasználót?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Hiba a felhasználó törlésekor');
      }

      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'employee'
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingUser;
    const url = isEditing ? `${API_BASE}/api/users/${editingUser._id}` : `${API_BASE}/api/users/register`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Hiba a mentéskor');
      }

      if (isEditing) {
        setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...formData } : u));
      } else {
        setUsers([...users, data.user || data]);
      }

      setShowAddForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'employee' });
  };

  if (loading) {
    return (
      <section className="page-container">
        <h1>{t.users?.title || 'Felhasználók'}</h1>
        <p>{t.menu?.loading || 'Betöltés...'}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-container">
        <h1>{t.users?.title || 'Felhasználók'}</h1>
        <div className="error">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <h1>{t.users?.title || 'Felhasználók'}</h1>
      <button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
        {t.users?.addUser || 'Új felhasználó hozzáadása'}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <h2>{editingUser ? (t.users?.editUser || 'Felhasználó szerkesztése') : (t.users?.addUser || 'Új felhasználó')}</h2>
          <label>
            {t.users?.name || 'Név'}:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </label>
          <label>
            {t.users?.email || 'Email'}:
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </label>
          <label>
            {t.users?.password || 'Jelszó'}:
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
            />
          </label>
          <label>
            {t.users?.role || 'Szerepkör'}:
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="employee">{t.users?.employee || 'Alkalmazott'}</option>
              <option value="boss">{t.users?.boss || 'Főnök'}</option>
            </select>
          </label>
          <div className="form-buttons">
            <button type="submit">{editingUser ? (t.users?.save || 'Mentés') : (t.users?.add || 'Hozzáadás')}</button>
            <button type="button" onClick={handleCancel}>{t.users?.cancel || 'Mégse'}</button>
          </div>
        </form>
      )}

      <div className="users-grid">
        {users.map((u) => (
          <div key={u._id} className="user-card">
            <div className="user-info">
              <div className="user-name">{u.name}</div>
              <div className="user-email">{u.email}</div>
              <span className="user-role">{u.role}</span>
            </div>
            <div className="user-actions">
              <button onClick={() => handleEdit(u)}>{t.users?.editUser || 'Szerkesztés'}</button>
              <button onClick={() => handleDelete(u._id)}>{t.users?.deleteUser || 'Törlés'}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Users;