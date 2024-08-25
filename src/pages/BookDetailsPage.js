// src/pages/BookDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../CSS/BookDetailsPage.css'; // Ensure you're importing the CSS file

const BookDetailsPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/books/${id}`);
                setBook(response.data);
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (!book) return <p>Loading...</p>;

    return (
        <div className="book-details-page">
            <div className="book-card">
                <h1>{book.title}</h1>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Published Date:</strong> {book.publicationYear}</p>
                <p><strong>Copies Available:</strong> {book.copiesAvailable}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                {/* Add more book details as needed */}
            </div>
        </div>
    );
};

export default BookDetailsPage;
