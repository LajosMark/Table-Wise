const mongoose = require('mongoose');
const autoIncrement = require('../middleware/autoIncrement');

const workHourSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    startDate: {
        type: Date,
        required: [true, 'Please add an start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
    }
})
autoIncrement(workHourSchema, 'workHourId');
module.exports.WorkHour = mongoose.model('WorkHour', workHourSchema,'workHours')