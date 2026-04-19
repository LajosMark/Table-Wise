const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// NoSQL injection protection
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
     windowMs: 1 * 60 * 1000, // 1 min
     max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Login limiting
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 10, // limit each IP to 10 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const userRoutes = require('./controllers/userController')
const workHourRoutes = require('./controllers/workHourController')
const workScheduleRoutes = require('./controllers/workScheduleController')
const mealRoutes = require('./controllers/mealController')
const mealCategoryController = require('./controllers/mealCategoryController');
const ingredientController = require('./controllers/ingredientController');
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument);
});

//Routes
app.use('/api/users', userRoutes);
app.use('/api/hours', workHourRoutes);
app.use('/api/schedules', workScheduleRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/meal-categories', mealCategoryController);
app.use('/api/ingredients', ingredientController);
app.use('/api/orders', orderController);
app.use('/api/fridge-items', fridgeItemController);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.listen(hostingPort, () => {
    console.log(`Server Started at port ${hostingPort}`);
}); 