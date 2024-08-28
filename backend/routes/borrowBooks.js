const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const router = express.Router();


// Route to borrow a book
router.post('/api/users/:userId/borrow', async (req, res) => {
    const { userId } = req.params;
    const { bookId } = req.body;


    try {
        const user = await User.findById(userId);
        const book = await Book.findById(bookId);


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }


        // Check if the book is available
        if (book.copiesAvailable <= 0) {
            return res.status(400).json({ message: 'No copies available' });
        }


        // Update book availability
        book.copiesAvailable -= 1;
        book.borrowedBy.push(user._id);


        // Calculate due date (30 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);


        // Add to user's borrowedBooks
        user.borrowedBooks.push({
            book: book._id,
            borrowedDate: new Date(),
            dueDate: dueDate
        });


        // Save the changes
        await book.save();
        await user.save();


        res.status(200).json({ message: 'Book borrowed successfully', dueDate });
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;