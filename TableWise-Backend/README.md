# Table Wise Backend

## Environment variables
    DATABASE_URL=
    PORT=
    JWT_SECRET=
    JWT_EXPIRE=

## ER Diagram
    https://dbdiagram.io
    ERD.dbml file

## Start
cd TableWise-Backend/TableWiseBackend
## Start with nodemon
### first start
    npm run setup-nodemon
### regular start
    npm run start-nodemon
## Start without nodemon
### first start
    npm run setup
### regular start
    npm start

# API Routes

## Users - /api/users
- POST /login
- POST /logout
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
- POST /:id/image
- PUT /:id
- DELETE /:id

## Meal Categories - /api/meal-categories
- GET /
- GET /:id
- GET /:id/meals
- POST /
- PUT /:id
- DELETE /:id

## Ingredients - /api/ingredients
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

## Fridge Items - /api/fridge-items
- GET /
- GET /:id
- POST /
- PATCH /:id
- DELETE /:id

## Static Files
- GET /images/:filename

## Swagger
- UI: /api-docs
- Raw spec: /api-docs.json
