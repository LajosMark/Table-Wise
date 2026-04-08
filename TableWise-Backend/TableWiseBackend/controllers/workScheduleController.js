const express = require('express');
const { WorkSchedule } = require('../models/workScheduleModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');

// Csak Admin és Manager
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const schedules = await WorkSchedule.find()
            .populate('usersId', 'name email')
            .populate('workHoursId');
        res.status(200).json({ data: schedules });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Csak Admin és Manager
router.get('/users/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const id = req.params.id        
        const schedules = await WorkSchedule.find({ usersId: id })
            .populate('usersId', 'name email')
            .populate('workHoursId');
        res.status(200).json({ data: schedules });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Csak saját beosztás
router.get('/my', protect, async (req, res) => {
    try {
        const mySchedules = await WorkSchedule.find({ usersId: req.user._id })
            .populate('workHoursId');
        res.status(200).json({ data: mySchedules });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Bejelentkezett
router.post('/', protect, async (req, res) => {
    try {
        const exists = await WorkSchedule.findOne({
            usersId: req.body.usersId,
            workHoursId: req.body.workHoursId
        });

        if (exists) {
            return res.status(400).json({ msg: 'Ez a hozzárendelés már létezik' });
        }

        const schedule = await WorkSchedule.create(req.body);
        res.status(201).json({ data: schedule });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Elfogadás (isAccepted) Admin és Manager
router.patch('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const schedule = await WorkSchedule.findByIdAndUpdate(
            req.params.id,
            { isAccepted: req.body.isAccepted },
            { new: true, runValidators: true }
        );

        if (!schedule) {
            return res.status(404).json({ msg: 'Beosztás nem található' });
        }

        res.status(200).json({ data: schedule });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin és Manager
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const schedule = await WorkSchedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ msg: 'Beosztás nem található' });
        }
        await schedule.deleteOne();
        res.status(200).json({ data: {} });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;