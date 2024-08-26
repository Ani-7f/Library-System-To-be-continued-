const express = require('express');
const Book = require('../models/Book');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Exporting the router function with upload as a parameter
module.exports = (upload) => {
    // Add a new book with an image
    router.post('/add', upload.single('image'), async (req, res) => {
        console.log('Received body:', req.body); // Debugging line to check the received form data
        console.log('Received file:', req.file); // Debugging line to check the received file
        const { title, author, genre, publicationYear, description, isbn, copiesAvailable } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).send('No cover image uploaded.');
        }

        try {
            const newFileName = `${Date.now()}-${file.originalname}`;
            const newFilePath = path.join(__dirname, '../uploads', newFileName);

            fs.rename(file.path, newFilePath, async (err) => {
                if (err) {
                    console.error('File upload failed:', err);
                    return res.status(500).send('File upload failed.');
                }

                const fileUrl = `/uploads/${newFileName}`;
                console.log('File saved at:', fileUrl);

                const newBook = new Book({
                    title,
                    author,
                    genre,
                    publicationYear,
                    imageUrl: fileUrl, // Save the URL of the uploaded image
                    description,
                    isbn, // Make sure isbn is saved in the database
                    copiesAvailable,
                });

                try {
                    const savedBook = await newBook.save();
                    res.status(200).json(savedBook);
                } catch (error) {
                    console.error('Failed to save book:', error);
                    res.status(500).send('Failed to save book.');
                }
            });
        } catch (err) {
            console.error('Failed to upload image:', err);
            res.status(500).send('Failed to upload image.');
        }
    });

    // Get all books
    router.get('/', async (req, res) => {
        try {
            const books = await Book.find();
            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Fetch books with pagination
router.get('/paginated', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalBooks = await Book.countDocuments();
        const books = await Book.find().skip(skip).limit(limit);

        res.json({
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


    // Get a specific book by ID
    router.get('/:id', async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json(book);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Update a book
    router.put('/:id', async (req, res) => {
        const { author, genre, publicationYear, isbn, copiesAvailable, title } = req.body;

        try {
            const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
                author,
                genre,
                publicationYear,
                isbn,
                copiesAvailable,
                title
            }, { new: true });

            if (!updatedBook) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.json(updatedBook);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Delete a book
    router.delete('/:id', async (req, res) => {
        try {
            const deletedBook = await Book.findByIdAndDelete(req.params.id);

            if (!deletedBook) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.json({ message: 'Book deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    return router;
};
