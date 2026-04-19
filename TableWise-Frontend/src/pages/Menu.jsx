import { useEffect, useState, useRef } from 'react';

const API_BASE = 'https://table-wise-backend-for-render-hosting-1.onrender.com';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [allMeals, setAllMeals] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const categoryRefs = useRef({});

  const fetchCategoriesAndMeals = async () => {
    setLoading(true);
    setError('');

    try {
      const [categoriesRes, mealsRes] = await Promise.all([
        fetch(`${API_BASE}/api/meal-categories`),
        fetch(`${API_BASE}/api/meals`),
      ]);

      if (!categoriesRes.ok) throw new Error('Error loading categories');
      if (!mealsRes.ok) throw new Error('Error loading meals');

      const categoriesData = await categoriesRes.json();
      const mealsData = await mealsRes.json();

      const categoriesList = Array.isArray(categoriesData.data) ? categoriesData.data : [];
      const mealsList = Array.isArray(mealsData.data) ? mealsData.data : [];
      const mealsMap = {};

      mealsList.forEach((meal) => {
        const categoryId = meal.categoryId ?? 'uncategorized';
        if (!mealsMap[categoryId]) mealsMap[categoryId] = [];
        mealsMap[categoryId].push(meal);
      });

      setCategories(categoriesList);
      setAllMeals(mealsMap);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndMeals();
  }, []);

  const scrollToCategory = (categoryId) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredMeals = (categoryId) => {
    const meals = allMeals[categoryId] || [];
    if (!searchTerm) return meals;
    return meals.filter((meal) =>
      (meal.name || meal.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meal.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <section className="page-container menu-page" data-cy="menu-page">
      <h1 data-cy="menu-title">Menu</h1>

      {error && <p className="error" data-cy="menu-error">{error}</p>}
      {loading && <p style={{ color: 'var(--text-main)', textAlign: 'center', padding: '2rem' }} data-cy="menu-loading">Loading...</p>}

      {!loading && categories.length > 0 && (
        <>
          <div className="horizontal-category-menu" data-cy="menu-category-menu">
            {categories.map((category) => (
              <button
                key={category._id}
                className="category-tab"
                onClick={() => scrollToCategory(category._id)}
                data-cy="menu-category-btn"
              >
                {category.name || category.title || `#${category._id}`}
              </button>
            ))}
          </div>

          <div className="categories-container">
            {categories.map((category) => {
              const meals = filteredMeals(category._id);
              return (
                <section
                  key={category._id}
                  ref={(el) => (categoryRefs.current[category._id] = el)}
                  className="category-section"
                >
                  <h2>{category.name || category.title}</h2>
                  {category.description && <p className="category-description">{category.description}</p>}

                  {meals.length === 0 ? (
                    <p>No meals in this category.</p>
                  ) : (
                    <div className="meals-grid" data-cy="menu-meals-grid">
                      {meals.map((meal) => {
                        const image = meal.image;
                        if (meal.isAvailable) {
                          return (
                            <article key={meal._id || meal.id} className="meal-card" data-cy="menu-meal-card">
                              {image && (
                                <div className="meal-card-image" data-cy="meal-card-image">
                                  <img
                                    src={`${API_BASE}/images/${image}`}
                                    alt={meal.name || meal.title || 'meal'}
                                    loading="lazy"
                                    onError={(e)=>{
                                      e.target.src = `${API_BASE}/images/no-image.png`;
                                      e.target.onerror = null;
                                    }}
                                  />
                                </div>
                              )}
                              <div className="meal-card-content" data-cy="meal-card-content">
                                <h3 data-cy="menu-meal-title">{meal.name || meal.title}</h3>
                                {meal.description && <p className="meal-card-description" data-cy="menu-meal-description">{meal.description}</p>}
                                {meal.price != null && <p className="price" data-cy="menu-meal-price">{meal.price} HUF</p>}
                              </div>
                            </article>
                          );
                        }
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}

      {!loading && categories.length === 0 && <p>No categories available.</p>}
    </section>
  );
};

export default Menu;
