const express = require('express');
const { Meal } = require('../models/mealModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');

// 1. GET ALL MEALS - Az összes étel lekérése (Bárki láthatja)
router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find();

        res.status(200).json({
            success: true,
            count: meals.length,
            data: meals
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
});

// 2. GET SINGLE MEAL - Egy konkrét étel lekérése ID alapján
router.get('/:id', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({ success: false, msg: 'Étel nem található' });
        }

        res.status(200).json({ success: true, data: meal });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

// 3. CREATE MEAL - Új étel hozzáadása (Csak Admin és Manager)
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const meal = await Meal.create(req.body);

        res.status(201).json({
            success: true,
            data: meal
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

// 4. UPDATE MEAL - Étel módosítása (Csak Admin és Manager)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!meal) {
            return res.status(404).json({ success: false, msg: 'Étel nem található' });
        }

        res.status(200).json({ success: true, data: meal });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

// 5. DELETE MEAL - Étel törlése (Csak Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({ success: false, msg: 'Étel nem található' });
        }

        await meal.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

module.exports = router;