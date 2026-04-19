const express = require('express');
const { Ingredient } = require('../models/ingredientModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');

// Any logged-in user (token required)
router.get('/', protect, async (req, res) => {
    try {
        const ingredients = await Ingredient.find()
            .populate('mealId', 'name')
            .populate('fridgeItemId', 'name unit');

        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Any logged-in user (token required)
router.get('/meal/:mealId', protect, async (req, res) => {
    try {
        const ingredients = await Ingredient.find({ mealId: req.params.mealId })
            .populate('fridgeItemId', 'name unit');

        res.status(200).json(ingredients);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin and manager only
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const ingredient = await Ingredient.create(req.body);
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin and manager only
router.patch('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!ingredient) {
            return res.status(404).json({ msg: 'Ingredient not found' });
        }

        res.status(200).json(ingredient);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin and manager only
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);

        if (!ingredient) {
            return res.status(404).json({ msg: 'Ingredient not found' });
        }

        await ingredient.deleteOne();
        res.status(204).json({});
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;