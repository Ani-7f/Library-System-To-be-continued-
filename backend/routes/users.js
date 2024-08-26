const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');
const router = express.Router();

const secret = 'your_jwt_secret'; // Use your actual secret key

// Helper function to verify token
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};

// Get all users with pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 4 } = req.query; // Default to page 1 and limit of 4
    const skip = (page - 1) * limit;
    
    try {
        const users = await User.find()
            .select('name') // Only select the name field
            .skip(parseInt(skip))
            .limit(parseInt(limit));
        const totalUsers = await User.countDocuments(); // Total number of users
        
        res.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get details of a specific user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('borrowedBooks.book') // Populate book details
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching user details:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Borrow a book
router.post('/:id/borrow', async (req, res) => {
    try {
        const { bookId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = await verifyToken(token);
        const user = await User.findById(req.params.id);
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.copiesAvailable <= 0) {
            return res.status(400).json({ message: 'No copies available' });
        }

        if (book.borrowedBy.includes(user._id)) {
            return res.status(400).json({ message: 'User has already borrowed this book' });
        }

        user.borrowedBooks.push({
            book: book._id,
            borrowedDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            fine: 0
        });

        book.borrowedBy.push(user._id);
        book.copiesAvailable -= 1;

        await user.save();
        await book.save();

        res.json({ message: 'Book borrowed successfully', user });
    } catch (err) {
        console.error('Error borrowing book:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Return a book
router.post('/:id/return', async (req, res) => {
    try {
        const { bookId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = await verifyToken(token);
        const user = await User.findById(req.params.id);
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const bookIndex = user.borrowedBooks.findIndex(b => b.book.toString() === book._id.toString());
        if (bookIndex === -1) {
            return res.status(400).json({ message: 'User has not borrowed this book' });
        }

        const borrowedBook = user.borrowedBooks[bookIndex];
        user.borrowedBooks.splice(bookIndex, 1);

        book.borrowedBy = book.borrowedBy.filter(id => !id.equals(user._id));
        book.copiesAvailable += 1;

        const now = new Date();
        if (borrowedBook.dueDate < now) {
            const overdueDays = Math.ceil((now - borrowedBook.dueDate) / (24 * 60 * 60 * 1000));
            user.finesOwed += overdueDays * 5; // Assuming $5 fine per day
        }

        await user.save();
        await book.save();

        res.json(user);
    } catch (err) {
        console.error('Error returning book:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Pay fine
router.post('/:userId/pay-fine', async (req, res) => {
    try {
        const userId = req.params.userId;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = await verifyToken(token);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.finesOwed = 0;
        await user.save();

        res.send({ message: 'Fine paid successfully' });
    } catch (e) {
        console.error('Error paying fine:', e.message);
        res.status(400).send({ error: 'Error paying fine' });
    }
});

module.exports = router;
