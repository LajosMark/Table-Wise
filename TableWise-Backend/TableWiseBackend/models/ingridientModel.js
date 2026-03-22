const mongoose = require('mongoose');
const autoIncrement = require('../middleware/autoIncrement');

const IngredientSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    mealId: {
        type: Number,
        required: [true, 'Please add a meal ID'],
        ref: 'Meal'
    },
    storageItemId: {
        type: Number,
        required: [true, 'Please add a storage item ID'],
        ref: 'StorageItem'
    },
    amountOfIngredient: {
        type: Number,
        required: [true, 'Please add the amount of ingredient'],
        min: [0.1, 'Amount must be at least 0.1']
    }
});

autoIncrement(IngredientSchema, 'ingredientId');

module.exports.Ingredient = mongoose.model('Ingredient', IngredientSchema, 'ingredients');