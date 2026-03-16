const express = require('express');
const { MealCategory } = require('../models/mealCategoryModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');

// 1. ÖSSZES KATEGÓRIA LEKÉRÉSE (Publikus)
router.get('/', async (req, res) => {
    console.log("get");
    
    try {
        const categories = await MealCategory.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
});

// 2. ÚJ KATEGÓRIA LÉTREHOZÁSA (Csak Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const MealCategory = await MealCategory.create(req.body);

        res.status(201).json({
            success: true,
            data: MealCategory
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

// 3. KATEGÓRIA MÓDOSÍTÁSA (Csak Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const MealCategory = await MealCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!MealCategory) {
            return res.status(404).json({ success: false, msg: 'Kategória nem található' });
        }

        res.status(200).json({ success: true, data: MealCategory });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

// 4. KATEGÓRIA TÖRLÉSE (Csak Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const MealCategory = await MealCategory.findById(req.params.id);

        if (!MealCategory) {
            return res.status(404).json({ success: false, msg: 'Kategória nem található' });
        }

        await MealCategory.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

module.exports = router;