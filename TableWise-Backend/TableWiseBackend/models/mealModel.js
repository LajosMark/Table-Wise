const mongoose = require('mongoose');
const autoIncrement = require('../middleware/autoIncrement');

const MealSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    categoryId: {
        type: Number, 
        required: [true, 'Please add a category ID']
    },
    image: {
        type: String, 
        default: 'no-image.png'
    }
});

autoIncrement(MealSchema, 'mealId');

module.exports.Meal = mongoose.model('Meal', MealSchema, 'meals');