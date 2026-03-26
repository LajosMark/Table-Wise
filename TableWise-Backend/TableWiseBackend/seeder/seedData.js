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

            { "name": "Bruschetta", "ingridientId": 101, "price": 1200, "isAvailable": true, "categoryId": 1 },
            { "name": "Tomato Soup", "ingridientId": 102, "price": 1100, "isAvailable": true, "categoryId": 2 },
            { "name": "Grilled Chicken", "ingridientId": 103, "price": 3500, "isAvailable": true, "categoryId": 3 },
            { "name": "Pizza Margherita", "ingridientId": 104, "price": 2800, "isAvailable": true, "categoryId": 4 },
            { "name": "Pasta Carbonara", "ingridientId": 105, "price": 3100, "isAvailable": true, "categoryId": 5 },
            { "name": "Greek Salad", "ingridientId": 106, "price": 2200, "isAvailable": true, "categoryId": 6 },
            { "name": "Tiramisu", "ingridientId": 107, "price": 1500, "isAvailable": true, "categoryId": 7 },
            { "name": "Espresso", "ingridientId": 108, "price": 600, "isAvailable": true, "categoryId": 8 },
            { "name": "French Fries", "ingridientId": 109, "price": 900, "isAvailable": true, "categoryId": 9 },
            { "name": "Small Pizza", "ingridientId": 110, "price": 1800, "isAvailable": true, "categoryId": 10 }
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
            { "mealId": 101, "storageItemId": 1, "amountOfIngredient": 2 },
            { "mealId": 102, "storageItemId": 8, "amountOfIngredient": 1 },
            { "mealId": 103, "storageItemId": 3, "amountOfIngredient": 1 },
            { "mealId": 104, "storageItemId": 5, "amountOfIngredient": 1 },
            { "mealId": 104, "storageItemId": 2, "amountOfIngredient": 1 },
            { "mealId": 105, "storageItemId": 6, "amountOfIngredient": 1 },
            { "mealId": 106, "storageItemId": 1, "amountOfIngredient": 3 },
            { "mealId": 107, "storageItemId": 2, "amountOfIngredient": 1 },
            { "mealId": 109, "storageItemId": 7, "amountOfIngredient": 1 },
            { "mealId": 110, "storageItemId": 5, "amountOfIngredient": 1 }
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

    FridgeItems:
        [
            { "_id": 1, "name": "Tomato", "amount": 50, "typeOfAmount": "kg", "pricePerUnit": 800, "categoryId": 1 },
            { "_id": 2, "name": "Mozzarella", "amount": 20, "typeOfAmount": "kg", "pricePerUnit": 3200, "categoryId": 2 },
            { "_id": 3, "name": "Chicken Breast", "amount": 30, "typeOfAmount": "kg", "pricePerUnit": 2500, "categoryId": 3 },
            { "_id": 4, "name": "Black Pepper", "amount": 5, "typeOfAmount": "kg", "pricePerUnit": 5000, "categoryId": 4 },
            { "_id": 5, "name": "Pizza Flour", "amount": 100, "typeOfAmount": "kg", "pricePerUnit": 400, "categoryId": 5 },
            { "_id": 6, "name": "Olive Oil", "amount": 25, "typeOfAmount": "l", "pricePerUnit": 4500, "categoryId": 6 },
            { "_id": 7, "name": "Frozen Peas", "amount": 15, "typeOfAmount": "kg", "pricePerUnit": 1200, "categoryId": 7 },
            { "_id": 8, "name": "Tomato Paste", "amount": 40, "typeOfAmount": "can", "pricePerUnit": 600, "categoryId": 8 },
            { "_id": 9, "name": "Burger Buns", "amount": 60, "typeOfAmount": "pcs", "pricePerUnit": 150, "categoryId": 9 },
            { "_id": 10, "name": "Cola Syrup", "amount": 10, "typeOfAmount": "l", "pricePerUnit": 2000, "categoryId": 10 }
        ]
}