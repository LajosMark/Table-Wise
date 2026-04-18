import { useEffect, useState } from 'react';

const API_BASE = 'https://table-wise-backend-for-render-hosting-1.onrender.com';

const AdminWorkSchedule = ({ user }) => {
  const [schedules, setSchedules] = useState([]);
  const [workHours, setWorkHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    usersId: '',
    workHoursId: '',
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  console.log(new Date("2026-04-19T12:00:00.000Z"));
  useEffect(() => {
    if (!user || !user.token || !['admin', 'manager'].includes(user.data.role)) {
      setError('You do not have permission.');
      return;
    }
    fetchSchedules();
    fetchWorkHours();
  }, [user]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/schedules`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
          throw new Error('errorNoPermissionSchedules');
        }
        throw new Error(data.msg || 'Error loading schedules');
      }
      setSchedules(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchWorkHours = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/hours`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
          throw new Error('errorNoPermissionWorkHours');
        }
        throw new Error(data.msg || 'Error loading work hours');
      }
      setWorkHours(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAccept = async (scheduleId, isAccepted) => {
    try {
      const response = await fetch(`${API_BASE}/api/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAccepted }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Error updating schedule status');
      fetchSchedules(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error deleting schedule');
      fetchSchedules(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/schedules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Error creating schedule');
      setShowAddForm(false);
      setFormData({ usersId: '', workHoursId: '' });
      fetchSchedules();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <section className="page-container">
        <h1>Manage Schedules</h1>
        <div className="error">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <h1>Manage Schedules</h1>

      <button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
        Add New Schedule
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="schedule-form">
          <h2>New Schedule</h2>
          <label>
            User:
            <input
              type="text"
              placeholder="User ID"
              value={formData.usersId}
              onChange={(e) => setFormData({ ...formData, usersId: e.target.value })}
              required
            />
          </label>
          <label>
            Shift:
            <select
              value={formData.workHoursId}
              onChange={(e) => setFormData({ ...formData, workHoursId: e.target.value })}
              required
            >
              <option value="">Choose...</option>
              {workHours.map((wh) => (
                <option key={wh._id} value={wh._id}>
                  {formatDateTime(wh.startDate)} - {formatDateTime(wh.endDate)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
          <button type="button" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <div className="schedules-list">
        <h2>All Schedules</h2>
        {schedules.length === 0 ? (
          <p>No schedules available.</p>
        ) : (
          <div className="schedules-grid">
            {schedules.map((schedule) => (
              <div key={schedule._id} className="schedule-card">
                <div className="schedule-info">
                  <p><strong>User:</strong> {schedule.usersId?.name || schedule.usersId?.email}</p>
                  <p><strong>Shift:</strong> {formatDateTime(schedule.workHoursId?.startDate)} - {formatDateTime(schedule.workHoursId?.endDate)}</p>
                  <span className={`status ${schedule.isAccepted ? 'accepted' : 'pending'}`}>
                    {schedule.isAccepted ? 'Accepted' : 'Pending'}
                  </span>
                </div>
                <div className="schedule-actions">
                  {!schedule.isAccepted && (
                    <button onClick={() => handleAccept(schedule._id, true)}>
                      Accept
                    </button>
                  )}
                  {schedule.isAccepted && (
                    <button onClick={() => handleAccept(schedule._id, false)}>
                      Reject
                    </button>
                  )}
                  <button onClick={() => handleDelete(schedule._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminWorkSchedule;