const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const router = express.Router();

// Route to borrow a book
router.post('/borrow/:userId/:bookId', async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        // Find the user and the book
        const user = await User.findById(userId);
        const book = await Book.findById(bookId);

        if (!user || !book) {
            return res.status(404).json({ message: 'User or Book not found' });
        }

        // Check if the book is available
        if (!book.availability) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // Update the book's availability
        book.availability = false;
        await book.save();

        // Calculate the due date (30 days from today)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        // Add the book to the user's borrowedBooks
        user.borrowedBooks.push({
            book: bookId,
            borrowedDate: new Date(),
            dueDate: dueDate
        });

        // Save the user with updated borrowedBooks
        await user.save();

        res.status(200).json({ message: 'Book borrowed successfully', dueDate });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
