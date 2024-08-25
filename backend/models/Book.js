const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    author: { type: String, required: true },
    borrowedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of ObjectIds
    copiesAvailable: { type: Number, required: true },
    isbn: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String }, // Added imageUrl field to store the path of the uploaded image
    description: { type: String } // Added description to store the book's description
});

module.exports = mongoose.model('Book', BookSchema);
