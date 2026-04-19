const express = require('express');
const { FridgeItem } = require('../models/fridgeItemModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');

// Admin and manager
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const items = await FridgeItem.find().populate('name');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Admin and manager
router.get('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const item = await FridgeItem.findById(req.params.id).populate('name');
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin and manager
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const item = await FridgeItem.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin and manager
router.patch('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const item = await FridgeItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin and manager
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const item = await FridgeItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        await item.deleteOne();
        res.status(204).json({});
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;