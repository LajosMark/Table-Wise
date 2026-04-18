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
      <section className="page-container" data-cy="admin-work-schedule-page">
        <h1 data-cy="admin-schedules-title">Manage Schedules</h1>
        <div className="error" data-cy="error-message">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-container" data-cy="admin-work-schedule-page">
      <h1 data-cy="admin-schedules-title">Manage Schedules</h1>

      <div className="schedules-list" data-cy="schedules-list">
        <h2 data-cy="all-schedules-title">All Schedules</h2>
        {schedules.length === 0 ? (
          <p data-cy="no-schedules-message">No schedules available.</p>
        ) : (
          <div className="schedules-grid" data-cy="schedules-grid">
            {schedules.map((schedule) => (
              <div key={schedule._id} className="schedule-card" data-cy="schedule-card" data-testid={`schedule-${schedule._id}`}>
                <div className="schedule-info" data-cy="schedule-info">
                  <p data-cy="schedule-user"><strong>User:</strong> {schedule.usersId?.name || schedule.usersId?.email}</p>
                  <p data-cy="schedule-shift"><strong>Shift:</strong> {formatDateTime(schedule.workHoursId?.startDate)} - {formatDateTime(schedule.workHoursId?.endDate)}</p>
                  <span className={`status ${schedule.isAccepted ? 'accepted' : 'pending'}`} data-cy="schedule-status">
                    {schedule.isAccepted ? 'Accepted' : 'Pending'}
                  </span>
                </div>
                <div className="schedule-actions" data-cy="schedule-actions">
                  {!schedule.isAccepted && (
                    <button onClick={() => handleAccept(schedule._id, true)} data-cy="schedule-accept-btn">
                      Accept
                    </button>
                  )}
                  {schedule.isAccepted && (
                    <button onClick={() => handleAccept(schedule._id, false)} data-cy="schedule-reject-btn">
                      Reject
                    </button>
                  )}
                  <button onClick={() => handleDelete(schedule._id)} data-cy="schedule-delete-btn">
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