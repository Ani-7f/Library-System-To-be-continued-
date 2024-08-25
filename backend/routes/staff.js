const express = require('express');
const Staff = require('../models/Staff');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get details of the logged-in staff
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Find staff member by ID from the request
        const staff = await Staff.findById(req.staffId);

        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // Send the staff data
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all staff members (optional, for admin use)
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.find(); // Fetch all staff members
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
