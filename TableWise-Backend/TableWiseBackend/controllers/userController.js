const express = require('express');
const { User } = require('../models/userModel');
const { WorkSchedule } = require('../models/workScheduleModel');
const jwt = require('jsonwebtoken');
const router = express.Router()
const { protect, authorize } = require('../middleware/Auth');

// Any logged-in user
router.get('/me', protect, async (req, res, next) => {
    try {
        res.status(200).json({
            data: req.user
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
// Admin and manager only
router.post('/id', protect, authorize('admin', 'manager'), async (req, res, next) => {
    try {

        const users = await User.find()
        let maxId = users[0]._id
        users.forEach(element => {
            if (element._id > maxId) maxId = Number(element._id)
        });
        maxId++;

        res.status(200).json({ msg: maxId })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }

})
// Admin and manager only
router.post('/register', protect, authorize('admin', 'manager'), async (req, res, next) => {
    try {

        const user = await User.create(req.body)

        const token = user.getSignedJwtToken()

        res.status(200).json({ token })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }

})
// Public
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password required' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = user.getSignedJwtToken();

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Logged in user can invalidate existing token
router.post('/logout', protect, async (req, res) => {
    try {
        req.user.tokenInvalidBefore = Date.now();
        await req.user.save();

        res.status(200).json({ msg: 'Logged out' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Admin and manager only
router.get('/', protect, authorize('admin', 'manager'), async (req, res, next) => {
    try {
        const users = await User.find().sort({ name: 1 })
        res.status(200).json(users);

    } catch (error) {
        console.error(error);
        res.status(404).json({ msg: 'Not found' });
    }
});

// Admin or owner only
router.patch('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ msg: 'You can only update your own profile!' });
        }

        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        if (req.user.role === 'admin' && req.body.role) {
            fieldsToUpdate.role = req.body.role;
        }

        const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
// Admin and manager only
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await WorkSchedule.deleteMany({ usersId: user._id });
        await user.deleteOne();

        res.status(200).json({ data: {} });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;