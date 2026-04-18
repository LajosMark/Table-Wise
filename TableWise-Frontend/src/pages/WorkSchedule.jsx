import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3000';

const WorkSchedule = ({ user }) => {
  const [mySchedules, setMySchedules] = useState([]);
  const [workHours, setWorkHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWorkHour, setSelectedWorkHour] = useState('');

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  console.log(mySchedules)
  useEffect(() => {
    if (!user || !user.token) {
      setError('You do not have permission.');
      return;
    }
    fetchMySchedules();
    fetchWorkHours();
  }, [user]);

  const fetchMySchedules = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/schedules/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
          throw new Error('errorNoPermissionSchedules');
        }
        throw new Error(data.msg || 'Error loading schedules');
      }
      setMySchedules(data.data || []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWorkHour) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/schedules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usersId: user._id,
          workHoursId: selectedWorkHour,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Hiba a beosztás létrehozásánál');
      setSelectedWorkHour('');
      fetchMySchedules(); // Frissítjük a listát
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <section className="page-container">
        <h1>Work Schedule</h1>
        <div className="error">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <h1>Work Schedule</h1>

      <div className="schedule-form">
        <h2>Request Shift</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Select shift:
            <select
              value={selectedWorkHour}
              onChange={(e) => setSelectedWorkHour(e.target.value)}
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
            {loading ? 'Requesting...' : 'Request'}
          </button>
        </form>
      </div>

      <div className="my-schedules">
        <h2>My Schedules</h2>
        {mySchedules.length === 0 ? (
          <p>No schedules available.</p>
        ) : (
          <ul>
            {mySchedules.map((schedule) => (
              <li key={schedule._id}>
                {formatDateTime(schedule.workHoursId?.startDate)} - {formatDateTime(schedule.workHoursId?.endDate)}
                <span className={`status ${schedule.isAccepted ? 'accepted' : 'pending'}`}>
                  {schedule.isAccepted ? 'Elfogadva' : 'Függőben'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default WorkSchedule;