const jwt = require('jwt-simple');
const User = require('../models/User'); 
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const userAuthMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        // Decode the token (does not verify the signature)
        const decoded = jwt.decode(token, JWT_SECRET);
        
        // Verify the token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.id; // Attach user ID to the request object
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = userAuthMiddleware;
