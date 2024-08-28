const express = require('express');
const Staff = require('../models/Staff');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get details of the logged-in staff
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Find staff member by ID from the request
        const staff = await Staff.findById(req.staffId).select('-password'); // Exclude password from response

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

// Update staff details, excluding password changes
router.put('/me', authMiddleware, async (req, res) => {
    const { name, username, email } = req.body;

    try {
        const staff = await Staff.findById(req.staffId);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        // Update fields if provided
        if (name) staff.name = name;
        if (username) staff.username = username;
        if (email) staff.email = email;

        await staff.save();
        res.json(staff);

    } catch (err) {
        console.error('Error updating staff details:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
