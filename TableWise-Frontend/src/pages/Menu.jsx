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
    <section className="page-container menu-page">
      <h1>Menu</h1>

      {error && <p className="error">{error}</p>}
      {loading && <p style={{ color: 'var(--text-main)', textAlign: 'center', padding: '2rem' }}>Loading...</p>}

      {!loading && categories.length > 0 && (
        <>
          <div className="horizontal-category-menu">
            {categories.map((category) => (
              <button
                key={category._id}
                className="category-tab"
                onClick={() => scrollToCategory(category._id)}
              >
                {category.name || category.title || `#${category._id}`}
              </button>
            ))}
          </div>

          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="search-icon">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
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
                    <div className="meals-grid">
                      {meals.map((meal) => {
                        const image = meal.image;
                        return (
                          <article key={meal._id || meal.id} className="meal-card">
                            {image && (
                              <div className="meal-card-image">
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
                            <div className="meal-card-content">
                              <h3>{meal.name || meal.title}</h3>
                              {meal.description && <p className="meal-card-description">{meal.description}</p>}
                              {meal.price != null && <p className="price">{meal.price} HUF</p>}
                            </div>
                          </article>
                        );
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
