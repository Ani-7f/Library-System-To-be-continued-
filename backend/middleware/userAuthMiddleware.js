const jwt = require('jwt-simple');
const User = require('../models/User'); 
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const userAuthMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.decode(token, JWT_SECRET);
        req.userId = decoded.id; 
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = userAuthMiddleware;
