const mongoose = require('mongoose');
const autoIncrement = require('../middleware/autoIncrement');

const MealCategorySchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    }
});

autoIncrement(MealCategorySchema, 'mealCategoryId');

module.exports.MealCategory = mongoose.model('MealCategory', MealCategorySchema, 'mealCategories');