const mongoose = require('mongoose');
const autoIncrement = require('../middleware/autoIncrement');

const workScheduleSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    usersId: {
        type: Number,
        ref: 'User',
        required: true
    },
    workHoursId: {
        type: Number,
        ref: 'WorkHour',
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
});

autoIncrement(workScheduleSchema, 'workScheduleId');
module.exports.WorkSchedule = mongoose.model('WorkSchedule', workScheduleSchema, 'workSchedules')