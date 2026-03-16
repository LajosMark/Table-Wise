import { FoodCategoriesCard, FoodInCategories } from "./FoodCategoriesCard"

const Foods = ({ foodcategories, mealCategoriesfetch }) => {
    return (
        <div className="container">
            <p>Keresés Mezö majd</p>
            <div className="mfoodcategories justify-content-start text-center">
                {
                    foodcategories.map((foodcategory) =>
                        <FoodCategoriesCard key={foodcategory.id} foodcategory={foodcategory} mealCategoriesfetch={mealCategoriesfetch} />
                    )
                }
            </div>
            <div className="justify-content-start text-center ">
                {
                    foodcategories.map((foodcategory) =>
                        <FoodInCategories key={foodcategory.id} foodcategory={foodcategory} mealCategoriesfetch={mealCategoriesfetch} />
                    )
                }
            </div>
        </div>
    )
}

export default Foods
