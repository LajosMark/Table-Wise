import { useEffect, useState } from 'react';

const API_BASE = 'https://table-wise-backend-for-render-hosting-1.onrender.com';

const Users = ({user }) => {
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
      setError('You do not have permission to view users.');
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
        throw new Error(data.message || 'Error loading users');
      }

      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Ismeretlen hiba');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting user');
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
        throw new Error(data.message || 'Error saving user');
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
      <section className="page-container" data-cy="users-page">
        <h1 data-cy="users-title">Users</h1>
        <p data-cy="users-loading">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-container" data-cy="users-page">
        <h1 data-cy="users-title">Users</h1>
        <div className="error" data-cy="users-error">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-container" data-cy="users-page">
      <h1 data-cy="users-title">Users</h1>
      <button onClick={() => setShowAddForm(true)} disabled={showAddForm} data-cy="users-add-btn">
        Add new user
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="user-form" data-cy="user-form">
          <h2 data-cy="user-form-title">{editingUser ? ('Edit user') : ('Add new user')}</h2>
          <label data-cy="user-label-name">
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-cy="user-name-input"
            />
          </label>
          <label data-cy="user-label-email">
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-cy="user-email-input"
            />
          </label>
          <label data-cy="user-label-password">
            Password:
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
              data-cy="user-password-input"
            />
          </label>
          <label data-cy="user-label-role">
            Role:
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              data-cy="user-role-select"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </label>
          <div className="form-buttons" data-cy="user-form-buttons">
            <button type="submit" data-cy="user-form-submit-btn">{editingUser ? 'Save' : 'Add'}</button>
            <button type="button" onClick={handleCancel} data-cy="user-form-cancel-btn">Cancel</button>
          </div>
        </form>
      )}

      <div className="users-grid" data-cy="users-grid">
        {users.map((u) => (
          <div key={u._id} className="user-card" data-cy="user-card">
            <div className="user-info" data-cy="user-info">
              <div className="user-name" data-cy="user-name">{u.name}</div>
              <div className="user-email" data-cy="user-email">{u.email}</div>
              <span className="user-role" data-cy="user-role">{u.role}</span>
            </div>
            <div className="user-actions" data-cy="user-actions">
              <button onClick={() => handleEdit(u)} data-cy="user-edit-btn">Edit</button>
              <button onClick={() => handleDelete(u._id)} data-cy="user-delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Users;