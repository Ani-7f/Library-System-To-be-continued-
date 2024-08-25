// src/pages/BookListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/BookListPage.css'; // Ensure you're importing the CSS file



const BookListPage = () => {

    
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        author: '',
        title: '',
        publicationYear: '',
        isbn: '',
        copiesAvailable: '',
        image: null // Add image state
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/books');
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleAddBook = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('author', newBook.author);
        formData.append('title', newBook.title);
        formData.append('publicationYear', newBook.publicationYear);
        formData.append('isbn', newBook.isbn);
        formData.append('copiesAvailable', newBook.copiesAvailable);
        formData.append('image', newBook.image); // Append the image file

        try {
            const response = await axios.post('http://localhost:5000/api/books/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setBooks([...books, response.data]);
            setNewBook({
                author: '',
                title: '',
                publicationYear: '',
                isbn: '',
                copiesAvailable: '',
                image: null // Reset image state
            });
        } catch (error) {
            console.error('Error adding book:', error.response || error.message);
            alert(`Failed to add book. ${error.response ? error.response.data.error : error.message}`);
        }
    };

    const handleDeleteBook = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`);
            setBooks(books.filter(book => book._id !== id));
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book. Please try again.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewBook({
            ...newBook,
            [name]: value
        });
    };

    const handleImageChange = (event) => {
        setNewBook({
            ...newBook,
            image: event.target.files[0] // Store the selected image file
        });
    };

    return (
        <div className="book-list-page">
            <div className="form-container">
                <form onSubmit={handleAddBook}>
                    <h2>Add a New Book</h2>
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newBook.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="publicationYear"
                        placeholder="Publication Year"
                        value={newBook.publicationYear}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="isbn"
                        placeholder="ISBN"
                        value={newBook.isbn}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="copiesAvailable"
                        placeholder="Copies Available"
                        value={newBook.copiesAvailable}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    <button type="submit">Add Book</button>
                </form>
            </div>
            <div className="books-container">
                {books.map(book => (
                    <div key={book._id} className="book-card">
                        <img src={`http://localhost:5000${book.imageUrl}`} alt={`${book.title} cover`} className="book-cover" />
                        <div className="book-details">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                        </div>
                        <div className="book-actions">
                            <Link to={`/books/${book._id}`}>
                                <button className="details-button">View Details</button>
                            </Link>
                            <button onClick={() => handleDeleteBook(book._id)} className="delete-button">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookListPage;
