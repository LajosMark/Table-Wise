import { useEffect, useState, useCallback } from "react";

const useFetchMeals = (url, id) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`${url}/${id}/meals`);
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error("Hiba a letöltés során:", err);
        } finally {
            setLoading(false);
        }
    }, [url, id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading };
};

const FoodCategoriesCard = ({ foodcategory, mealCategoriesfetch }) => {
    const { data: meals } = useFetchMeals(mealCategoriesfetch, foodcategory.id);

    return (
        <div className="card mb-1 m-1 mfoodcategory rounded-4">
            <div className="card-body m-1">
                <i className="fa-solid fa-burger"></i>
                <h4 className="card-title">{foodcategory.nev}</h4>
                <p className="card-text">{meals.length} étel</p>
            </div>
        </div>
    );
};

const FoodInCategories = ({ foodcategory, mealCategoriesfetch }) => {
    const { data: meals } = useFetchMeals(mealCategoriesfetch, foodcategory.id);

    return (
        <div className="mt-4">
            <div className="m-1">
                <h4 className="mfoodcategoryname col-3">{foodcategory.nev}</h4>
                {meals.map((meal) => (
                    <div key={meal.id || meal.name} className="card mb-1 m-1 mfoodcategory rounded-4">
                        <div className="card-body m-1">
                            <h4 className="card-title">{meal.name}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { FoodCategoriesCard, FoodInCategories }