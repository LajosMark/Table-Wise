//require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// NoSQL injection protection
app.use(mongoSanitize());

// Rate limiting (100 / 15 min)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 1000000, // limit 1000000 requests per windowMs (15 min)
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Login limiting (5 / 1 min)
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const userRoutes = require('./controllers/userController')
const workHourRoutes = require('./controllers/workHourController')
const workScheduleRoutes = require('./controllers/workScheduleController')
const mealRoutes = require('./controllers/mealController')
const mealCategoryController = require('./controllers/mealCategoryController');
const ingredientController = require('./controllers/ingridientController');
const orderController = require('./controllers/orderController');
const fridgeItemController = require('./controllers/fridgeItemController');

const hostingPort = process.env.PORT;

mongoose.set('strictQuery', true);
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'tablewise'
});

const database = mongoose.connection;

database.on('error', (error) => {
    console.log("MongoDB connection error. Is the 'mongodb' container running?");
    console.log(error);
});

database.once('connected', () => {
    console.log("Database Connected");
});

app.use(express.json());

// Rate limiting middleware
app.use('/api/', limiter);
app.use('/api/users/login', loginLimiter);

//Routes
app.use('/api/users', userRoutes);
app.use('/api/hours', workHourRoutes);
app.use('/api/schedules', workScheduleRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/meal-categories', mealCategoryController);
app.use('/api/ingridients', ingredientController);
app.use('/api/orders', orderController);
app.use('/api/fridge-items', fridgeItemController);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.listen(hostingPort, () => {
    console.log(`Server Started at port ${hostingPort}`);
}); 