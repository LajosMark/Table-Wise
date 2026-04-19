import { useEffect, useState } from 'react';

const API_BASE = 'https:table-wise-backend-for-render-hosting-1.onrender.com';

const MealManagement = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('meals');

  const [editingMealId, setEditingMealId] = useState(null);
  const [mealEditData, setMealEditData] = useState({});
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingFridgeItemId, setEditingFridgeItemId] = useState(null);
  const [fridgeItemEditData, setFridgeItemEditData] = useState({});
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
        fetch(`${API_BASE}/api/ingredients`, { headers: authHeaders() }),
        fetch(`${API_BASE}/api/fridge-items`, { headers: authHeaders() }),
      ]);

      const catData = await catRes.json();
      const mealData = await mealRes.json();
      const ingData = await ingRes.json();
      const fridgeData = await fridgeRes.json();

      setCategories(catData.data || []);
      setMeals(mealData.data || []);
      setIngredients(Array.isArray(ingData) ? ingData : ingData.data || []);
      setFridgeItems(fridgeData || []);
    } catch (err) {
      setError('Error synchronizing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdminOrManager) loadData(); }, [isAdminOrManager]);

  const handleUpdateFridgeItem = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/fridge-items/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(fridgeItemEditData),
      });
      if (res.ok) {
        setEditingFridgeItemId(null);
        loadData();
      }
    } catch (err) { setError('Failed to update fridge item.'); }
  };

  const handleUpdateCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/meal-categories/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ name: catEditName }),
      });
      if (res.ok) {
        setEditingCatId(null);
        loadData();
      }
    } catch (err) { setError('Failed to update category.'); }
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingMealId;
    const url = isEditing ? `${API_BASE}/api/meals/${editingMealId}` : `${API_BASE}/api/meals`;
    try {
      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(mealEditData),
      });
      if (res.ok) {
        setEditingMealId(null);
        setMealEditData({});
        loadData();
      }
    } catch (err) { setError('Save error.'); }
  };

  const handleMealAvailabilityChange = async (mealId, isAvailable) => {
    try {
      const res = await fetch(`${API_BASE}/api/meals/${mealId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ isAvailable }),
        });
      if (res.ok) loadData();
    } catch (err) { setError('Failed to update meal availability.'); }
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
    } catch (err) { setError('Image upload failed.'); }
  };

  const handleAddIngredientToMeal = async (mealId) => {
    if (!newIngredientRow.fridgeItemId || !newIngredientRow.amountOfIngredient) return;
    try {
      const res = await fetch(`${API_BASE}/api/ingredients`, {
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
      setError('Error adding ingredient.');
    }
  };

  const genericDelete = async (endpoint, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    await fetch(`${API_BASE}${endpoint}/${id}`, { method: 'DELETE', headers: authHeaders() });
    loadData();
  };

  if (!isAdminOrManager) return <div className="page-container" data-cy="meal-management-page">Admin access required.</div>;

  return (
    <section className="page-container menu-page admin-layout" data-cy="meal-management-page">
      <header className="admin-header" data-cy="meal-management-header">
        <h1 className="category-title" data-cy="meal-management-title">Meals and Categories Management</h1>
        <div className="horizontal-category-menu" data-cy="meal-management-tabs">
          <button className={`category-tab ${activeSection === 'meals' ? 'active' : ''}`} onClick={() => setActiveSection('meals')} data-cy="meal-management-tab-meals">Meals & Recipes</button>
          <button className={`category-tab ${activeSection === 'fridge' ? 'active' : ''}`} onClick={() => setActiveSection('fridge')} data-cy="meal-management-tab-fridge">Fridge & Inventory</button>
          <button className={`category-tab ${activeSection === 'cats' ? 'active' : ''}`} onClick={() => setActiveSection('cats')} data-cy="meal-management-tab-cats">Categories</button>
        </div>
      </header>

      {error && <div className="error-banner" style={{ background: '#ff4b4b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }} data-cy="meal-management-error">{error}</div>}

      {/* --- MEAL MANAGEMENT --- */}
      {activeSection === 'meals' && (
        <div className="admin-content">
          <div className="card-surface editor-box">
            <h3 data-cy="meal-form-title">{editingMealId ? 'Edit Meal' : 'Add New Meal'}</h3>
            <form onSubmit={handleMealSubmit} className="admin-grid-form" data-cy="meal-form">
              <input className="search-input" placeholder="Name" value={mealEditData.name || ''} onChange={e => setMealEditData({ ...mealEditData, name: e.target.value })} required data-cy="meal-name-input" />
              <input className="search-input" type="number" placeholder="Price" value={mealEditData.price || ''} onChange={e => setMealEditData({ ...mealEditData, price: e.target.value })} required data-cy="meal-price-input" />
              <select className="search-input" value={mealEditData.categoryId || ''} onChange={e => setMealEditData({ ...mealEditData, categoryId: e.target.value })} required data-cy="meal-category-select">
                <option value="">Category...</option>
                {categories.map(c => <option key={c._id} value={c._id} data-cy="meal-category-option">{c.name}</option>)}
              </select>
              <div className="form-buttons" data-cy="meal-form-buttons">
                <button type="submit" className="category-tab active" data-cy="meal-save-btn">Save</button>
                {editingMealId && <button type="button" className="category-tab" onClick={() => { setEditingMealId(null); setMealEditData({}); }} data-cy="meal-cancel-btn">Cancel</button>}
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
                    <p className="price-tag">{meal.price} HUF</p>
                    <label className="availability-toggle">
                      Available: <input type='checkbox' checked={meal.isAvailable} onChange={(e) => handleMealAvailabilityChange(meal._id, e.target.checked)} />
                    </label>
                  </div>
                </div>

                <div className="recipe-management">
                  <h5>Ingredients</h5>
                  <div className="recipe-list">
                    {ingredients.filter(i => String(i.mealId?._id || i.mealId) === String(meal._id)).map(ing => (
                      <div key={ing._id} className="recipe-item">
                        <span>{ing.fridgeItemId?.name} - {ing.amountOfIngredient} {fridgeItems.find(f => String(f._id) === String(ing.fridgeItemId?._id))?.typeOfAmount || 'unit'}</span>
                        <button onClick={() => genericDelete('/api/ingredients', ing._id)}>×</button>
                      </div>
                    ))}
                    {ingredients.filter(i => String(i.mealId?._id || i.mealId) === String(meal._id)).length === 0 && (
                      <div className="recipe-item empty">No ingredients assigned.</div>
                    )}
                  </div>
                  <div className="recipe-add-row">
                    <select value={newIngredientRow.fridgeItemId} onChange={e => setNewIngredientRow({ ...newIngredientRow, fridgeItemId: e.target.value })}>
                      <option value="">Select ingredient</option>
                      {fridgeItems.map(f => (
                        <option key={f._id} value={f._id}>{f.name} ({f.typeOfAmount})</option>
                      ))}
                    </select>
                    <input type="number" step="0.1" placeholder="Quantity" value={newIngredientRow.amountOfIngredient} onChange={e => setNewIngredientRow({ ...newIngredientRow, amountOfIngredient: e.target.value })} />
                    <button type="button" className="add-ingredient-btn" onClick={() => handleAddIngredientToMeal(meal._id)}>Add</button>
                  </div>
                </div>

                <div className="meal-card-footer">
                  <button className="edit-btn" onClick={() => { setEditingMealId(meal._id); setMealEditData(meal); window.scrollTo(0, 0); }}>Edit</button>
                  <button className="danger-btn" onClick={() => genericDelete('/api/meals', meal._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CATEGORY MANAGEMENT --- */}
      {activeSection === 'cats' && (
        <div className="admin-content">
          <div className="card-surface editor-box">
            <h3>New Category</h3>
            <form className="flex-row" onSubmit={(e) => { e.preventDefault(); /* handleCreateCategory */ }}>
              <input className="search-input" placeholder="Category name" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              <button className="category-tab active">Add</button>
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
                      <button className="edit-icon-btn" onClick={() => genericDelete('/api/meal-categories', c._id)}>🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- FRIDGE MANAGEMENT --- */}
      {activeSection === 'fridge' && (
        <div className="admin-content">
          <div className="card-surface editor-box">
            <h3>New Fridge Item</h3>
            <form className="admin-grid-form" onSubmit={(e) => { e.preventDefault(); /* handleCreateFridgeItem */ }}>
              <input className="search-input" placeholder="Name" value={newFridgeItem.name} onChange={e => setNewFridgeItem({ ...newFridgeItem, name: e.target.value })} required />
              <div style={{ display: 'flex', gap: '4px' }}>
                <input className="search-input" type="number" placeholder="Quantity" value={newFridgeItem.amount} onChange={e => setNewFridgeItem({ ...newFridgeItem, amount: e.target.value })} required />
                <input className="search-input" placeholder="Unit (e.g. kg, pcs)" value={newFridgeItem.typeOfAmount} onChange={e => setNewFridgeItem({ ...newFridgeItem, typeOfAmount
                  : e.target.value })} required />
              </div>
              <input className="search-input" type="number" placeholder="Unit price" value={newFridgeItem.pricePerUnit} onChange={e => setNewFridgeItem({ ...newFridgeItem, pricePerUnit: e.target.value })} required />
              <input className="search-input" type="number" placeholder="Warning threshold (%)" value={newFridgeItem.warningAmountPercentage} onChange={e => setNewFridgeItem({ ...newFridgeItem, warningAmountPercentage: e.target.value })} required />
              <div className="form-buttons">
                <button type="submit" className="category-tab active">Add</button>
              </div>
            </form>
          </div>

          <div className='card-surface table-wrapper'>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Unit Price</th>
                  <th>Warning %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fridgeItems.map(item => (
                  <tr key={item._id}>
                    {editingFridgeItemId === item._id ? (
                      /* --- EDIT MODE --- */
                      <>
                        <td>
                          <input
                            className="search-input"
                            value={fridgeItemEditData.name}
                            onChange={e => setFridgeItemEditData({ ...fridgeItemEditData, name: e.target.value })}
                          />
                        </td>
                        <td>
                          <div className="flex-row" style={{ gap: '4px' }}>
                            <input
                              className="search-input"
                              type="number"
                              style={{ width: '60px' }}
                              value={fridgeItemEditData.amount}
                              onChange={e => setFridgeItemEditData({ ...fridgeItemEditData, amount: e.target.value })}
                            />
                            <input
                              className="search-input"
                              style={{ width: '50px' }}
                              value={fridgeItemEditData.typeOfAmount}
                              onChange={e => setFridgeItemEditData({ ...fridgeItemEditData, typeOfAmount: e.target.value })}
                            />
                          </div>
                        </td>
                        <td>
                          <input
                            className="search-input"
                            type="number"
                            style={{ width: '80px' }}
                            value={fridgeItemEditData.pricePerUnit}
                            onChange={e => setFridgeItemEditData({ ...fridgeItemEditData, pricePerUnit: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            className="search-input"
                            type="number"
                            style={{ width: '60px' }}
                            value={fridgeItemEditData.warningAmountPercentage}
                            onChange={e => setFridgeItemEditData({ ...fridgeItemEditData, warningAmountPercentage: e.target.value })}
                          />
                        </td>
                        <td>
                          <div className="flex-row">
                            <button className="save-icon-btn" onClick={() => handleUpdateFridgeItem(item._id)}>✅</button>
                            <button className="save-icon-btn" onClick={() => setEditingFridgeItemId(null)}>❌</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      /* --- VIEW MODE --- */
                      <>
                        <td>{item.name}</td>
                        <td>{item.amount} {item.typeOfAmount}</td>
                        <td>{item.pricePerUnit} HUF</td>
                        <td>{item.warningAmountPercentage}%</td>
                        <td>
                          <div className="flex-row">
                            <button
                              className="edit-icon-btn"
                              onClick={() => {
                                setEditingFridgeItemId(item._id);
                                setFridgeItemEditData(item);
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              className="edit-icon-btn"
                              onClick={() => genericDelete('/api/fridge-items', item._id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default MealManagement;