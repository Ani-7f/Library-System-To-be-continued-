// routes/auth.js
const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');
const router = express.Router();

// Replace with your secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register route
router.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the email or username already exists
        const existingStaff = await Staff.findOne({ $or: [{ email }, { username }] });
        if (existingStaff) {
            return res.status(400).json({ message: 'Email or username already in use.' });
        }

        // Create new staff member
        const newStaff = new Staff({ name, username, email, password });

        await newStaff.save();

        // Generate JWT token
        const token = jwt.encode({ id: newStaff._id }, JWT_SECRET);
        res.status(201).json({ message: 'Registration successful', token });

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(401).json({ message: 'Invalid email or password. Please try again.' });
        }

        const isMatch = await staff.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password. Please try again.' });
        }

        const token = jwt.encode({ id: staff._id }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
