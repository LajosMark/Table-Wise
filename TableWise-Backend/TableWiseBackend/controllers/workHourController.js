const express = require('express')
const { WorkHour } = require('../models/workHourModel')
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth')

// Any logged-in user
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

// Admin and manager only
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

// Admin and manager only
router.patch('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const workHour = await WorkHour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!workHour) {
            return res.status(404).json({ msg: 'Work hour not found' });
        }

        res.status(200).json({ data: workHour });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin and manager only
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const workHour = await WorkHour.findById(req.params.id);

        if (!workHour) {
            return res.status(404).json({ msg: 'Work hour not found' });
        }

        await workHour.deleteOne();
        res.status(204).json({ data: {} });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;