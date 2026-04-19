const mongoose = require('mongoose');
const autoIncrement = require('../middleware/autoIncrement');

const OrderSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    mealId: {
        type: Number,
        required: [true, 'Please add a meal ID'],
        ref: 'Meal'
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be less than 0'],
        max: [100, 'Discount cannot be more than 100']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: [1, 'Amount must be at least 1']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

autoIncrement(OrderSchema, 'orderId');

module.exports.Order = mongoose.model('Order', OrderSchema, 'orders');