require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const userRoutes = require('./controllers/userController')
const workHourRoutes = require('./controllers/workHourController')
const workScheduleRoutes = require('./controllers/workScheduleController')
const mealRoutes = require('./controllers/mealController')
const mealCategoryController = require('./controllers/mealCategoryController');
const ingredientController = require('./controllers/ingridientController');

const PORT = process.env.NODE_DOCKER_PORT || 3000;

mongoose.set('strictQuery', true);
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const database = mongoose.connection;

database.on('error', (error) => {
    console.log("MongoDB connection error. Is the 'mongodb' container running?");
    console.log(error);
});

database.once('connected', () => {
    console.log(process.env.MONGODB_LAUNCH_MESSAGE);
});

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/hours', workHourRoutes);
app.use('/api/schedules', workScheduleRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/mealCategories', mealCategoryController);
app.use('/api/ingridients', ingredientController);
app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`);
});