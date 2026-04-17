const express = require('express');
const multer = require('multer');
const path = require('path');
const { Meal } = require('../models/mealModel');
const { Ingredient } = require('../models/ingridientModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

// (Bárki láthatja)
router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find();

        res.status(200).json({

            data: meals
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// (Bárki láthatja)
router.get('/:id', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({ msg: 'Étel nem található' });
        }

        res.status(200).json({ data: meal });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// (Csak Admin és Manager)
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const meal = await Meal.create(req.body);

        res.status(201).json({

            data: meal
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Kép feltöltése egy ételhez (Csak Admin és Manager)
router.post('/:id/image', protect, authorize('admin', 'manager'), upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Kép fájl szükséges' });
        }

        const meal = await Meal.findById(req.params.id);
        if (!meal) {
            return res.status(404).json({ msg: 'Étel nem található' });
        }

        meal.image = `${req.file.filename}`;
        await meal.save();

        res.status(200).json({ data: meal });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// (Csak Admin és Manager)
router.patch('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!meal) {
            return res.status(404).json({ msg: 'Étel nem található' });
        }

        res.status(200).json({ data: meal });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// (Csak Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({ msg: 'Étel nem található' });
        }

        await Ingredient.deleteMany({ mealId: meal._id });
        await meal.deleteOne();

        res.status(204).json({ data: {} });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;