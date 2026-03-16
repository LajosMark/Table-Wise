const express = require('express')
const { WorkHour } = require('../models/workHourModel')
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth')

// Mindenki
router.post('/', protect, async (req, res) => {
    try {
        const workHour = await WorkHour.create(req.body);
        res.status(201).json({

            data: workHour
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin és Manager
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const workHours = await WorkHour.find();
        res.status(200).json({

            count: workHours.length,
            data: workHours
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Admin és Manager
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const workHour = await WorkHour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!workHour) {
            return res.status(404).json({ msg: 'Munkaóra nem található' });
        }

        res.status(200).json({ data: workHour });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Csak Admin és Manager
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const workHour = await WorkHour.findById(req.params.id);

        if (!workHour) {
            return res.status(404).json({ msg: 'Munkaóra nem található' });
        }

        await workHour.deleteOne();
        res.status(200).json({ data: {} });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;