const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ success: false, msg: 'User not found' });
        }

        if (req.user.tokenInvalidBefore && decoded.iat * 1000 < req.user.tokenInvalidBefore.getTime()) {
            return res.status(401).json({ success: false, msg: 'Token expired' });
        }

        next();
    } catch (error) {
        res.status(401).json({ success: false, msg: 'Invalid token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                msg: `Role (${req.user.role}) is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };