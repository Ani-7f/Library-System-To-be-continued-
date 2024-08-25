import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookList = () => {
    const [books, setBooks] = useState([]);

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

    return (
        <div>
            <h2>Available Books</h2>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        <h3>{book.title}</h3>
                        <p>Author: {book.author}</p>
                        <p>Publication Year: {book.publicationYear}</p>
                        <p>ISBN: {book.isbn}</p>
                        <p>Copies Available: {book.copiesAvailable}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;
