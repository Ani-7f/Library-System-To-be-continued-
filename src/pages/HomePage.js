import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/HomePage.css';

const HomePage = ({ onLogout }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/books');
                const allBooks = response.data;
                const shuffledBooks = allBooks.sort(() => 0.5 - Math.random()).slice(0, 5);
                setBooks(shuffledBooks);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

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
            <div className="container">
                <aside className="sidebar">
                    <h1 className="sidebar-title">Navigation</h1>
                    <nav className="sidebar-nav">
                        <ul>
                            <li><Link to="/Home" className="nav-link">Home</Link></li>
                            <li><Link to="/Staff" className="nav-link">Staff Info</Link></li>
                            <li><Link to="/Users" className="nav-link">User Info</Link></li>
                            <li><Link to="/Books" className="nav-link">Books</Link></li>
                            <li><button className="nav-link logout-button" onClick={onLogout}>Log Out</button></li>
                        </ul>
                    </nav>
                </aside>
                <main className="main-content">
                    <section className="section-books">
                        <h1 className="section-title">Top 5 Books</h1>
                        <table className="books-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Year</th>
                                    <th>ISBN</th>
                                    <th>Copies</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book._id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publicationYear}</td>
                                        <td>{book.isbn}</td>
                                        <td>{book.copiesAvailable}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
