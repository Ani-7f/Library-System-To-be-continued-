import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/UserDetailPage.css';

const UserDetailPage = ({ onLogout }) => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');

    const booksPerPage = 5;

    useEffect(() => {
        const fetchUserAndBooks = async () => {
            try {
                // Fetch user details
                const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(userResponse.data);

                // Fetch paginated books
                const booksResponse = await axios.get(`http://localhost:5000/api/books/paginated?page=${currentPage}&limit=${booksPerPage}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (Array.isArray(booksResponse.data.books)) {
                    setBooks(booksResponse.data.books);
                    setTotalPages(booksResponse.data.totalPages);
                } else {
                    throw new Error('Books data is not an array');
                }
            } catch (error) {
                console.error('Error details:', error.response ? error.response.data : error.message);
                setError('Error fetching user details or books');
            }
        };

        fetchUserAndBooks();
    }, [userId, currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleBorrowBook = async (bookId) => {
        try {
            await axios.post(`http://localhost:5000/api/users/${userId}/borrow`, { bookId }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh user details after borrowing
            const updatedUserResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(updatedUserResponse.data);
        } catch (error) {
            setError('Error borrowing book');
            console.error('Error borrowing book:', error.response ? error.response.data : error.message);
        }
    };

    const handleMarkFinePaid = async (borrowedBookId) => {
        try {
            await axios.post(`http://localhost:5000/api/users/${userId}/mark-fine-paid`, { borrowedBookId }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh user details after marking fine as paid
            const updatedUserResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(updatedUserResponse.data);
        } catch (error) {
            setError('Error marking fine as paid');
            console.error('Error marking fine as paid:', error.response ? error.response.data : error.message);
        }
    };

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    const borrowedBooks = user.borrowedBooks || [];

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
        <div className="user-detail-page">
            <aside className="sidebar">
                <h2 className="sidebar-title">Navigation</h2>
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
            <div className="sections-container">
                <div className="user-details">
                    <h1>User Details</h1>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Fines Owed: R{user.finesOwed}</p>
                    <p>Updated At: {new Date(user.updatedAt).toLocaleDateString()}</p>

                    <h2>Borrowed Books</h2>
                    {borrowedBooks.length === 0 ? (
                        <p>No borrowed books</p>
                    ) : (
                        <ul>
                            {borrowedBooks.map((entry) => (
                                <li key={entry._id}>
                                    {entry.book ? entry.book.title : 'Unknown Book'} (Due: {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : 'N/A'})
                                    {entry.finePaid ? ' (Fine Paid)' : (
                                        <button onClick={() => handleMarkFinePaid(entry._id)}>Mark Fine as Paid</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="book-list-container">
                    <h2>Available Books</h2>
                    <ul className="book-list">
                        {books.length === 0 ? (
                            <p>No books available.</p>
                        ) : (
                            books.map((book) => (
                                <li className="book-list-item" key={book._id}>
                                    {book.title} - {book.author}
                                    <button onClick={() => handleBorrowBook(book._id)}>Borrow</button>
                                </li>
                            ))
                        )}
                    </ul>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default UserDetailPage;
