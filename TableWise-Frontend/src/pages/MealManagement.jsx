import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3000';

const MealManagement = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('meals');

  console.log(
    meals.map(meal => (
    ingredients.filter(i => String(i.mealId?._id || i.mealId) === String(meal._id)).map(ing => (
      fridgeItems.filter(f => f)
    ))))
  )


  // Szerkesztési állapotok
  const [editingMealId, setEditingMealId] = useState(null);
  const [mealEditData, setMealEditData] = useState({});
  const [editingCatId, setEditingCatId] = useState(null);
  const [catEditName, setCatEditName] = useState('');

  const [newIngredientRow, setNewIngredientRow] = useState({ fridgeItemId: '', amountOfIngredient: '' });
  const [newCatName, setNewCatName] = useState('');
  const [newFridgeItem, setNewFridgeItem] = useState({ name: '', amount: '', typeOfAmount: 'kg', pricePerUnit: '', warningAmountPercentage: 10 });

  const isAdminOrManager = user?.token && ['admin', 'manager'].includes(user.data?.role);

  const authHeaders = (isMultipart = false) => {
    const headers = { Authorization: `Bearer ${user.token}` };
    if (!isMultipart) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, mealRes, ingRes, fridgeRes] = await Promise.all([
        fetch(`${API_BASE}/api/meal-categories`, { headers: authHeaders() }),
        fetch(`${API_BASE}/api/meals`, { headers: authHeaders() }),
        fetch(`${API_BASE}/api/ingridients`, { headers: authHeaders() }),
        fetch(`${API_BASE}/api/fridge-items`, { headers: authHeaders() }),
      ]);

      const catData = await catRes.json();
      const mealData = await mealRes.json();
      const ingData = await ingRes.json();
      const fridgeData = await fridgeRes.json();
      console.log(fridgeData)

      setCategories(catData.data || []);
      setMeals(mealData.data || []);
      setIngredients(Array.isArray(ingData) ? ingData : ingData.data || []);
      setFridgeItems(fridgeData || []);
    } catch (err) {
      setError('Hiba az adatok szinkronizálásakor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdminOrManager) loadData(); }, [isAdminOrManager]);

  // --- KATEGÓRIA SZERKESZTÉS ---
  const handleUpdateCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/meal-categories/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ name: catEditName }),
      });
      if (res.ok) {
        setEditingCatId(null);
        loadData();
      }
    } catch (err) { setError("Kategória frissítése sikertelen."); }
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingMealId;
    const url = isEditing ? `${API_BASE}/api/meals/${editingMealId}` : `${API_BASE}/api/meals`;
    try {
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(mealEditData),
      });
      if (res.ok) {
        setEditingMealId(null);
        setMealEditData({});
        loadData();
      }
    } catch (err) { setError("Mentési hiba."); }
  };

  const handleImageUpload = async (mealId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await fetch(`${API_BASE}/api/meals/${mealId}/image`, {
        method: 'POST',
        headers: authHeaders(true),
        body: formData,
      });
      loadData();
    } catch (err) { setError("Képfeltöltési hiba."); }
  };

  const handleAddIngredientToMeal = async (mealId) => {
    if (!newIngredientRow.fridgeItemId || !newIngredientRow.amountOfIngredient) return;
    try {
      const res = await fetch(`${API_BASE}/api/ingridients`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          mealId: mealId,
          fridgeItemId: newIngredientRow.fridgeItemId,
          amountOfIngredient: newIngredientRow.amountOfIngredient,
        }),
      });
      if (res.ok) {
        setNewIngredientRow({ fridgeItemId: '', amountOfIngredient: '' });
        loadData();
      }
    } catch (err) {
      setError('Hiba az összetevő hozzáadásakor.');
    }
  };

  const genericDelete = async (endpoint, id) => {
    if (!window.confirm('Biztosan törölni szeretnéd?')) return;
    await fetch(`${API_BASE}${endpoint}/${id}`, { method: 'DELETE', headers: authHeaders() });
    loadData();
  };

  if (!isAdminOrManager) return <div className="page-container">Admin hozzáférés szükséges.</div>;

  return (
    <section className="page-container menu-page admin-layout">
      <header className="admin-header">
        <h1 className="category-title">Adminisztrációs Felület</h1>
        <div className="horizontal-category-menu">
          <button className={`category-tab ${activeSection === 'meals' ? 'active' : ''}`} onClick={() => setActiveSection('meals')}>Ételek & Receptek</button>
          <button className={`category-tab ${activeSection === 'fridge' ? 'active' : ''}`} onClick={() => setActiveSection('fridge')}>Hűtő & Készlet</button>
          <button className={`category-tab ${activeSection === 'cats' ? 'active' : ''}`} onClick={() => setActiveSection('cats')}>Kategóriák</button>
        </div>
      </header>

      {error && <div className="error-banner" style={{ background: '#ff4b4b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      {/* --- ÉTELEK KEZELÉSE --- */}
      {activeSection === 'meals' && (
        <div className="admin-content">
          <div className="card-surface editor-box">
            <h3>{editingMealId ? 'Étel Módosítása' : 'Új Étel Hozzáadása'}</h3>
            <form onSubmit={handleMealSubmit} className="admin-grid-form">
              <input className="search-input" placeholder="Név" value={mealEditData.name || ''} onChange={e => setMealEditData({ ...mealEditData, name: e.target.value })} required />
              <input className="search-input" type="number" placeholder="Ár" value={mealEditData.price || ''} onChange={e => setMealEditData({ ...mealEditData, price: e.target.value })} required />
              <select className="search-input" value={mealEditData.categoryId || ''} onChange={e => setMealEditData({ ...mealEditData, categoryId: e.target.value })} required>
                <option value="">Kategória...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="form-buttons">
                <button type="submit" className="category-tab active">Mentés</button>
                {editingMealId && <button type="button" className="category-tab" onClick={() => { setEditingMealId(null); setMealEditData({}); }}>Mégse</button>}
              </div>
            </form>
          </div>

          <div className="meals-admin-grid">
            {meals.map(meal => (
              <div key={meal._id} className="meal-card card-surface">
                <div className="meal-card-header">
                  <div className="meal-img-container">
                    <img src={`${API_BASE}/images/${meal.image}`} alt={meal.name} />
                    <label className="image-upload-overlay">
                      <input type="file" onChange={(e) => handleImageUpload(meal._id, e.target.files[0])} hidden />
                      <span>📸</span>
                    </label>
                  </div>
                  <div>
                    <h4>{meal.name}</h4>
                    <p className="price-tag">{meal.price} Ft</p>
                  </div>
                </div>

                <div className="recipe-management">
                  <h5>Összetevők</h5>
                  <div className="recipe-list">
                    {ingredients.filter(i => String(i.mealId?._id || i.mealId) === String(meal._id)).map(ing => (
                      <div key={ing._id} className="recipe-item">
                        <span>{ing.fridgeItemId?.name} - {ing.amountOfIngredient} {fridgeItems.find(f => String(f._id) === String(ing.fridgeItemId?._id))?.typeOfAmount || 'egység'}</span>
                        <button onClick={() => genericDelete('/api/ingridients', ing._id)}>×</button>
                      </div>
                    ))}
                    {ingredients.filter(i => String(i.mealId?._id || i.mealId) === String(meal._id)).length === 0 && (
                      <div className="recipe-item empty">Nincs hozzárendelt összetevő.</div>
                    )}
                  </div>
                  <div className="recipe-add-row">
                    <select value={newIngredientRow.fridgeItemId} onChange={e => setNewIngredientRow({ ...newIngredientRow, fridgeItemId: e.target.value })}>
                      <option value="">Alapanyag kiválasztása</option>
                      {fridgeItems.map(f => (
                        <option key={f._id} value={f._id}>{f.name} ({f.typeOfAmount})</option>
                      ))}
                    </select>
                    <input type="number" step="0.1" placeholder="Mennyiség" value={newIngredientRow.amountOfIngredient} onChange={e => setNewIngredientRow({ ...newIngredientRow, amountOfIngredient: e.target.value })} />
                    <button type="button" className="add-ingredient-btn" onClick={() => handleAddIngredientToMeal(meal._id)}>Hozzáadás</button>
                  </div>
                </div>

                <div className="meal-card-footer">
                  <button className="edit-btn" onClick={() => { setEditingMealId(meal._id); setMealEditData(meal); window.scrollTo(0, 0); }}>Szerkeszt</button>
                  <button className="danger-btn" onClick={() => genericDelete('/api/meals', meal._id)}>Töröl</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- KATEGÓRIÁK KEZELÉSE --- */}
      {activeSection === 'cats' && (
        <div className="admin-content">
          <div className="card-surface editor-box">
            <h3>Új Kategória</h3>
            <form className="flex-row" onSubmit={(e) => { e.preventDefault(); /* handleCreateCategory */ }}>
              <input className="search-input" placeholder="Kategória neve" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              <button className="category-tab active">Hozzáadás</button>
            </form>
          </div>

          <div className="cat-admin-list">
            {categories.map(c => (
              <div key={c._id} className="cat-card card-surface">
                {editingCatId === c._id ? (
                  <div className="flex-row" style={{ width: '100%' }}>
                    <input className="search-input" value={catEditName} onChange={e => setCatEditName(e.target.value)} autoFocus />
                    <button className="save-icon-btn" onClick={() => handleUpdateCategory(c._id)}>✅</button>
                    <button className="save-icon-btn" onClick={() => setEditingCatId(null)}>❌</button>
                  </div>
                ) : (
                  <>
                    <span className="cat-name">{c.name}</span>
                    <div className="cat-actions">
                      <button className="edit-icon-btn" onClick={() => { setEditingCatId(c._id); setCatEditName(c.name); }}>✏️</button>
                      <button className="edit-icon-btn danger" onClick={() => genericDelete('/api/meal-categories', c._id)}>🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- HŰTŐ KEZELÉSE --- */}
      {activeSection === 'fridge' && (
        <div className="admin-content card-surface table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Név</th><th>Készlet</th><th>Műveletek</th></tr>
            </thead>
            <tbody>
              {fridgeItems.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.amount} {item.typeOfAmount}</td>
                  <td><button className="danger-btn-small" onClick={() => genericDelete('/api/fridge-items', item._id)}>Törlés</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MealManagement;