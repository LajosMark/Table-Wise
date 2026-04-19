const mongoose = require('mongoose');
const autoIncrement = require('../middleware/autoIncrement');

const FridgeItemSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: [0, 'Amount cannot be negative']
    },
    typeOfAmount: {
        type: String,
        required: [true, 'Please add a unit (kg, l, pcs, etc.)']
    },
    pricePerUnit: {
        type: Number,
        required: [true, 'Please add a price per unit']
    },
    warningAmountPercentage: {
        type: Number,
        required: [true, 'Please add a warning percentage'],
        min: [1, 'Percentage must be at least 1'],
        max: [100, 'Percentage cannot exceed 100'],
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    }
});

autoIncrement(FridgeItemSchema, 'fridgeItemId');

module.exports.FridgeItem = mongoose.model('FridgeItem', FridgeItemSchema, 'fridgeItems');