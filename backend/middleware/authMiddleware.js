// middleware/authMiddleware.js
const jwt = require('jwt-simple');
//const Staff = require('../models/Staff');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.decode(token, JWT_SECRET);
        req.staffId = decoded.id; // Set staff ID to request object
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;