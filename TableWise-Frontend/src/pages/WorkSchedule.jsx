import { useCallback, useEffect, useState } from 'react';

const API_BASE = 'https:table-wise-backend-for-render-hosting-1.onrender.com';

const WorkSchedule = ({ user }) => {
  const [mySchedules, setMySchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('this');
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState(9);
  const [endTime, setEndTime] = useState(17);

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

  const getWeekStart = (weekType) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1);
    if (weekType === 'next') {
      monday.setDate(monday.getDate() + 7);
    } else if (weekType === 'twoWeeks') {
      monday.setDate(monday.getDate() + 14);
    }
    return monday;
  };

  const getWeekDays = () => {
    const weekStart = getWeekStart(selectedWeek);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };
  
  const fetchMySchedules = useCallback(async () => {
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
  }, [user.token]);

  useEffect(() => {
    if (!user || !user.token) {
      setError('You do not have permission.');
      return;
    } else {
      fetchMySchedules();
    }
  }, [fetchMySchedules, user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const duration = endTime - startTime;

    if (!selectedDay) {
      setError('Please select a day for the shift.');
      return;
    }
    if (startTime >= endTime) {
      setError('Start time must be before end time.');
      return;
    }
    if (duration <= 4 || duration >= 10) {
      setError('Shift must be longer than 4 hours and shorter than 10 hours.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const startDate = new Date(selectedDay);
      startDate.setHours(startTime, 0, 0, 0);
      const endDate = new Date(selectedDay);
      endDate.setHours(endTime, 0, 0, 0);

      const response = await fetch(`${API_BASE}/api/hours`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Error creating work hour');
      try {
        const response = await fetch(`${API_BASE}/api/schedules`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usersId: user.data._id,
            workHoursId: data.data._id,
          }),
        });
        const scheduleData = await response.json();
        if (!response.ok) throw new Error(scheduleData.msg || 'Error creating schedule');
      } catch (error) {
        setError(error.message || 'Error creating schedule');
      }
      setSelectedDay(null);
      setStartTime(9);
      setEndTime(17);
      fetchMySchedules();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <section className="page-container" data-cy="work-schedule-page">
        <h1 data-cy="work-schedule-title">Work Schedule</h1>
        <div className="error" data-cy="work-schedule-error">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-container" data-cy="work-schedule-page">
      <h1 data-cy="work-schedule-title">Work Schedule</h1>

      <div className="schedule-form" data-cy="work-schedule-form">
        <h2 data-cy="work-schedule-form-title">Request Shift</h2>
        <form onSubmit={handleSubmit} data-cy="work-schedule-form-inner">
          <label data-cy="work-schedule-week-label">
            Select week:
            <select
              value={selectedWeek}
              onChange={(e) => {
                setSelectedWeek(e.target.value);
                setSelectedDay(null);
              }}
              data-cy="work-schedule-week-select"
            >
              <option value="this">This week</option>
              <option value="next">Next week</option>
              <option value="twoWeeks">Two weeks later</option>
            </select>
          </label>
          <div className="week-days" data-cy="week-days">
            {getWeekDays().map((day, index) => (
              <button
                key={index}
                type="button"
                className={selectedDay && selectedDay.getTime() === day.getTime() ? 'selected' : ''}
                onClick={() => setSelectedDay(day)}
                data-cy="week-day-btn"
              >
                {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
          {selectedDay && (
            <div className="time-selection" data-cy="time-selection">
              <label data-cy="start-time-label">
                Start time: {startTime}:00
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={startTime}
                  onChange={(e) => setStartTime(parseFloat(e.target.value))}
                  data-cy="start-time-range"
                />
              </label>
              <label data-cy="end-time-label">
                End time: {endTime}:00
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={endTime}
                  onChange={(e) => setEndTime(parseFloat(e.target.value))}
                  data-cy="end-time-range"
                />
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={
              loading ||
              !selectedDay ||
              startTime >= endTime ||
              endTime - startTime <= 4 ||
              endTime - startTime >= 10
            }
            data-cy="work-schedule-submit-btn"
          >
            {loading ? 'Requesting...' : 'Request'}
          </button>
        </form>
      </div>

      <div className="my-schedules" data-cy="my-schedules">
        <h2 data-cy="my-schedules-title">My Schedules</h2>
        {mySchedules.length === 0 ? (
          <p data-cy="no-my-schedules">No schedules available.</p>
        ) : (
          <ul data-cy="my-schedules-list">
            {mySchedules.map((schedule) => (
              <li key={schedule._id} data-cy="my-schedule-item">
                {formatDateTime(schedule.workHoursId?.startDate)} - {formatDateTime(schedule.workHoursId?.endDate)}
                <span className={`status ${schedule.isAccepted ? 'accepted' : 'pending'}`} data-cy="schedule-status">
                  {schedule.isAccepted ? 'Accepted' : 'Pending'}
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