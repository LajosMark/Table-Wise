import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3000';

const AdminWorkSchedule = ({ t, user }) => {
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
    return date.toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (!user || !user.token || !['admin', 'manager'].includes(user.data.role)) {
      setError('Nincs jogosultságod.');
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
      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
          throw new Error(t('errorNoPermissionSchedules'));
        }
        throw new Error(data.msg || 'Hiba a beosztások lekérésénél');
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
          throw new Error(t('errorNoPermissionWorkHours'));
        }
        throw new Error(data.msg || 'Hiba a munkaórák lekérésénél');
      }
      setWorkHours(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAccept = async (scheduleId, isAccepted) => {
    try {
      const response = await fetch(`${API_BASE}/api/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAccepted }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Hiba az állapot módosításánál');
      fetchSchedules(); // Frissítjük a listát
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!confirm(t.adminWorkSchedule?.confirmDelete || 'Biztosan törlöd?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Hiba a törlésnél');
      fetchSchedules(); // Frissítjük a listát
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
      if (!response.ok) throw new Error(data.msg || 'Hiba a létrehozásnál');
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
        <h1>{t.adminWorkSchedule?.title || 'Beosztások Kezelése'}</h1>
        <div className="error">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <h1>{t.adminWorkSchedule?.title || 'Beosztások Kezelése'}</h1>

      <button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
        {t.adminWorkSchedule?.addSchedule || 'Új Beosztás Hozzáadása'}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="schedule-form">
          <h2>{t.adminWorkSchedule?.addNewSchedule || 'Új Beosztás'}</h2>
          <label>
            {t.adminWorkSchedule?.selectUser || 'Felhasználó'}:
            <input
              type="text"
              placeholder="User ID"
              value={formData.usersId}
              onChange={(e) => setFormData({ ...formData, usersId: e.target.value })}
              required
            />
          </label>
          <label>
            {t.adminWorkSchedule?.selectShift || 'Műszak'}:
            <select
              value={formData.workHoursId}
              onChange={(e) => setFormData({ ...formData, workHoursId: e.target.value })}
              required
            >
              <option value="">{t.adminWorkSchedule?.chooseShift || 'Válassz...'}</option>
              {workHours.map((wh) => (
                <option key={wh._id} value={wh._id}>
                  {formatDateTime(wh.startDate)} - {formatDateTime(wh.endDate)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? (t.adminWorkSchedule?.creating || 'Létrehozás...') : (t.adminWorkSchedule?.create || 'Létrehozás')}
          </button>
          <button type="button" onClick={() => setShowAddForm(false)}>
            {t.adminWorkSchedule?.cancel || 'Mégse'}
          </button>
        </form>
      )}

      <div className="schedules-list">
        <h2>{t.adminWorkSchedule?.allSchedules || 'Összes Beosztás'}</h2>
        {schedules.length === 0 ? (
          <p>{t.adminWorkSchedule?.noSchedules || 'Nincsenek beosztások.'}</p>
        ) : (
          <div className="schedules-grid">
            {schedules.map((schedule) => (
              <div key={schedule._id} className="schedule-card">
                <div className="schedule-info">
                  <p><strong>{t.adminWorkSchedule?.user || 'Felhasználó'}:</strong> {schedule.usersId?.name || schedule.usersId?.email}</p>
                  <p><strong>{t.adminWorkSchedule?.shift || 'Műszak'}:</strong> {formatDateTime(schedule.workHoursId?.startDate)} - {formatDateTime(schedule.workHoursId?.endDate)}</p>
                  <span className={`status ${schedule.isAccepted ? 'accepted' : 'pending'}`}>
                    {schedule.isAccepted ? (t.adminWorkSchedule?.accepted || 'Elfogadva') : (t.adminWorkSchedule?.pending || 'Függőben')}
                  </span>
                </div>
                <div className="schedule-actions">
                  {!schedule.isAccepted && (
                    <button onClick={() => handleAccept(schedule._id, true)}>
                      {t.adminWorkSchedule?.accept || 'Elfogadás'}
                    </button>
                  )}
                  {schedule.isAccepted && (
                    <button onClick={() => handleAccept(schedule._id, false)}>
                      {t.adminWorkSchedule?.reject || 'Elutasítás'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(schedule._id)}>
                    {t.adminWorkSchedule?.delete || 'Törlés'}
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