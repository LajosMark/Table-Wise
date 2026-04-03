# Table Wise Backend

# API Routes

## Users - /api/users
- POST /login
- POST /register
- GET /me
- POST /id
- GET /
- PUT /:id
- DELETE /:id

## Work Hours - /api/hours
- POST /
- GET /
- PUT /:id
- DELETE /:id

## Work Schedule - /api/schedules
- GET /
- GET /users/:id
- GET /my
- POST /
- PUT /:id
- DELETE /:id

## Meals - /api/meals
- GET /
- GET /:id
- POST /
- PUT /:id
- DELETE /:id

## Meal Categories - /api/mealCategories
- GET /
- GET /:id
- GET /:id/meals
- POST /
- PUT /:id
- DELETE /:id

## Ingredients - /api/ingridients
- GET /
- GET /meal/:mealId
- POST /
- PUT /:id
- DELETE /:id

## Orders - /api/orders
- GET /
- GET /:id
- POST /
- PATCH /:id
- DELETE /:id

## Fridge Items - /api/fridgeItems
- GET /
- GET /:id
- POST /
- PATCH /:id
- DELETE /:id

## Static Files
- GET /images/:filename
