module.exports.Data = {

    Users:
        [
            { "_id": 1, "name": "asd", "email": "asd@asd.com", "password": "asdasdasd" },
            { "_id": 2, "name": "manager", "email": "manager@manager.com", "password": "managermanager", "role": "manager" },
            { "_id": 3, "name": "admin", "email": "admin@admin.com", "password": "adminadmin", "role": "admin" },
            { "_id": 4, "name": "pelda", "email": "pelda@pelda.com", "password": "peldapeldapelda" },
            { "_id": 5, "name": "aaa", "email": "aaa@aaa.com", "password": "aaaaaaaaa" }
        ],

    WorkSchedules:
        [
            { "_id": 1, "usersId": 1, "workHoursId": 1, "isAccepted": true },
            { "_id": 2, "usersId": 2, "workHoursId": 1, "isAccepted": true },
            { "_id": 3, "usersId": 3, "workHoursId": 2, "isAccepted": true },
            { "_id": 4, "usersId": 4, "workHoursId": 2, "isAccepted": false },
            { "_id": 5, "usersId": 5, "workHoursId": 3, "isAccepted": true },
            { "_id": 6, "usersId": 6, "workHoursId": 3, "isAccepted": true },
            { "_id": 7, "usersId": 7, "workHoursId": 4, "isAccepted": true },
            { "_id": 8, "usersId": 8, "workHoursId": 5, "isAccepted": true },
            { "_id": 9, "usersId": 9, "workHoursId": 6, "isAccepted": false },
            { "_id": 10, "usersId": 10, "workHoursId": 7, "isAccepted": true }
        ],

    WorkHours:
        [
            { "_id": 1, "startDate": "2026-03-10T08:00:00Z", "endDate": "2026-03-10T16:00:00Z" },
            { "_id": 2, "startDate": "2026-03-10T16:00:00Z", "endDate": "2026-03-11T00:00:00Z" },
            { "_id": 3, "startDate": "2026-03-11T08:00:00Z", "endDate": "2026-03-11T16:00:00Z" },
            { "_id": 4, "startDate": "2026-03-11T16:00:00Z", "endDate": "2026-03-12T00:00:00Z" },
            { "_id": 5, "startDate": "2026-03-12T08:00:00Z", "endDate": "2026-03-12T16:00:00Z" }
        ],

    Meals:
        [

            { "name": "Bruschetta", "price": 1200, "isAvailable": true, "categoryId": 1 },
            { "name": "Tomato Soup", "price": 1100, "isAvailable": true, "categoryId": 1 },
            { "name": "Grilled Chicken", "price": 3500, "isAvailable": true, "categoryId": 3 },
            { "name": "Pizza Margherita", "price": 2800, "isAvailable": true, "categoryId": 4 },
            { "name": "Pasta Carbonara", "price": 3100, "isAvailable": true, "categoryId": 5 },
            { "name": "Greek Salad", "price": 2200, "isAvailable": true, "categoryId": 6 },
            { "name": "Tiramisu", "price": 1500, "isAvailable": true, "categoryId": 7 },
            { "name": "Espresso", "price": 600, "isAvailable": true, "categoryId": 8 },
            { "name": "French Fries", "price": 900, "isAvailable": true, "categoryId": 9 },
            { "name": "Small Pizza", "price": 1800, "isAvailable": true, "categoryId": 10 }
        ],

    MealCategories:
        [
            { "_id": 1, "name": "Appetizers" },
            { "_id": 2, "name": "Soups" },
            { "_id": 3, "name": "Main Courses" },
            { "_id": 4, "name": "Pizzas" },
            { "_id": 5, "name": "Pastas" },
            { "_id": 6, "name": "Salads" },
            { "_id": 7, "name": "Desserts" },
            { "_id": 8, "name": "Beverages" },
            { "_id": 9, "name": "Sides" },
            { "_id": 10, "name": "Kids Menu" }
        ],

    Ingridients:
        [
            {"_id": 1, "mealId": 1, "fridgeItemId": 1, "amountOfIngredient": 2 },
            {"_id": 2, "mealId": 2, "fridgeItemId": 8, "amountOfIngredient": 1 },
            {"_id": 3, "mealId": 3, "fridgeItemId": 3, "amountOfIngredient": 1 },
            {"_id": 4, "mealId": 4, "fridgeItemId": 5, "amountOfIngredient": 1 },
            {"_id": 5, "mealId": 5, "fridgeItemId": 2, "amountOfIngredient": 1 },
            {"_id": 6, "mealId": 6, "fridgeItemId": 6, "amountOfIngredient": 1 },
            {"_id": 7, "mealId": 7, "fridgeItemId": 1, "amountOfIngredient": 3 },
            {"_id": 8, "mealId": 8, "fridgeItemId": 2, "amountOfIngredient": 1 },
            {"_id": 9, "mealId": 9, "fridgeItemId": 7, "amountOfIngredient": 1 },
            {"_id": 10, "mealId": 10, "fridgeItemId": 5, "amountOfIngredient": 1 }
        ],

    Orders:
        [
            { "_id": 1, "mealId": 1, "discount": 0, "amount": 2 },
            { "_id": 2, "mealId": 4, "discount": 10, "amount": 1 },
            { "_id": 3, "mealId": 8, "discount": 0, "amount": 3 },
            { "_id": 4, "mealId": 2, "discount": 0, "amount": 1 },
            { "_id": 5, "mealId": 5, "discount": 5, "amount": 1 },
            { "_id": 6, "mealId": 3, "discount": 0, "amount": 2 },
            { "_id": 7, "mealId": 7, "discount": 0, "amount": 4 },
            { "_id": 8, "mealId": 10, "discount": 0, "amount": 1 },
            { "_id": 9, "mealId": 6, "discount": 15, "amount": 1 },
            { "_id": 10, "mealId": 9, "discount": 0, "amount": 2 }
        ],

    FridgeItems: [
        { "_id": 1, "name": "Tomato", "amount": 50, "typeOfAmount": "kg", "pricePerUnit": 800, "warningAmountPercentage": 10 },
        { "_id": 2, "name": "Mozzarella", "amount": 20, "typeOfAmount": "kg", "pricePerUnit": 3200, "warningAmountPercentage": 5 },
        { "_id": 3, "name": "Chicken Breast", "amount": 30, "typeOfAmount": "kg", "pricePerUnit": 2500, "warningAmountPercentage": 8 },
        { "_id": 4, "name": "Black Pepper", "amount": 5, "typeOfAmount": "kg", "pricePerUnit": 5000, "warningAmountPercentage": 1 },
        { "_id": 5, "name": "Pizza Flour", "amount": 100, "typeOfAmount": "kg", "pricePerUnit": 400, "warningAmountPercentage": 20 },
        { "_id": 6, "name": "Olive Oil", "amount": 25, "typeOfAmount": "l", "pricePerUnit": 4500, "warningAmountPercentage": 5 },
        { "_id": 7, "name": "Frozen Peas", "amount": 15, "typeOfAmount": "kg", "pricePerUnit": 1200, "warningAmountPercentage": 3 },
        { "_id": 8, "name": "Tomato Paste", "amount": 40, "typeOfAmount": "can", "pricePerUnit": 600, "warningAmountPercentage": 10 },
        { "_id": 9, "name": "Burger Buns", "amount": 60, "typeOfAmount": "pcs", "pricePerUnit": 150, "warningAmountPercentage": 15 },
        { "_id": 10, "name": "Cola Syrup", "amount": 10, "typeOfAmount": "l", "pricePerUnit": 2000, "warningAmountPercentage": 2 }
    ],
    Counters: [
        { _id: "userId", seq: 0 },
        { _id: "mealId", seq: 0 },
        { _id: "mealCategoryId", seq: 0 },
        { _id: "workHourId", seq: 0 },
        { _id: "workScheduleId", seq: 0 },
        { _id: "ingredientId", seq: 0 },
        { _id: "orderId", seq: 0 },
        { _id: "fridgeItemId", seq: 0 },
    ]
}