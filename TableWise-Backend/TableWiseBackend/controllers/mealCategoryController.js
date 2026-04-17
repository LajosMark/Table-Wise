const express = require('express');
const { MealCategory } = require('../models/mealCategoryModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');
const { Meal } = require('../models/mealModel');

//(Publikus)
router.get('/', async (req, res) => {

    try {
        const categories = await MealCategory.find().sort({ name: 1 });

        res.status(200).json({


            data: categories
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

//(Publikus)
router.get('/:id', async (req, res) => {

    try {

        const categories = await MealCategory.find({ _id: req.params.id });

        res.status(200).json({

            data: categories
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get('/:id/meals', async (req, res) => {

    try {

        const categories = await Meal.find({ categoryId: req.params.id }).sort({ name: 1 });

        res.status(200).json({

            data: categories
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// (Csak Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const PostMealCategory = await MealCategory.create(req.body);

        res.status(201).json({

            data: PostMealCategory
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// (Csak Admin)
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const PatchMealCategory = await MealCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!PatchMealCategory) {
            return res.status(404).json({ msg: 'Kategória nem található' });
        }

        res.status(200).json({ data: PatchMealCategory });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// (Csak Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const DeleteMealCategory = await MealCategory.findById(req.params.id);

        if (!DeleteMealCategory) {
            return res.status(404).json({ msg: 'Kategória nem található' });
        }

        await DeleteMealCategory.deleteOne();

        res.status(204).json({ data: {} });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;