const express = require('express');
const { Order } = require('../models/orderModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/Auth');

// Csak Admin és Manager
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const orders = await Order.find().populate('mealId', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Csak Admin és Manager
router.get('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('mealId', 'name price');
        if (!order) {
            return res.status(404).json({ msg: 'Rendelés nem található' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Minden bejelentkezett felhasználó (Token szükséges)
router.post('/', protect, async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Csak Admin és Manager
router.patch('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!order) {
            return res.status(404).json({ msg: 'Rendelés nem található' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Csak Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Rendelés nem található' });
        }
        await order.deleteOne();
        res.status(200).json({});
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;