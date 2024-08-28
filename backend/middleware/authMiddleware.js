const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, JWT_SECRET);
        req.staffId = decoded.id; // Set staff ID to request object
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
