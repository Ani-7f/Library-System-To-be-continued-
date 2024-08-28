// src/pages/BookDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Combined the imports from 'react-router-dom'
import axios from 'axios';
import '../CSS/BookDetailsPage.css'; // Ensure you're importing the CSS file

const BookDetailsPage = ({ onLogout }) => {
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
    <div className="page-wrapper">
      <div className="gradient-bg">
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive"></div>
        </div>
      </div>
      
      {/* Main container for sidebar and book details */}
      <div className="container">
        <aside className="sidebar">
          <h1 className="sidebar-title">Navigation</h1>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <Link to="/Home" className="nav-link">Home</Link>
              </li>
              <li>
                <Link to="/Staff" className="nav-link">Staff Info</Link>
              </li>
              <li>
                <Link to="/Users" className="nav-link">User Info</Link>
              </li>
              <li>
                <Link to="/Books" className="nav-link">Books</Link>
              </li>
              <li>
                <button className="nav-link logout-button" onClick={onLogout}>Log Out</button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Book details section */}
        <div className="book-details-page">
          <div className="book-card">
            <h1>{book.title}</h1>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Published Date:</strong> {book.publicationYear}</p>
            <p><strong>Copies Available:</strong> {book.copiesAvailable}</p>
            <p><strong>Borrowed By:</strong> {book.borrowedBy}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
