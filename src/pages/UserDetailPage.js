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
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // For showing the modal
    const [selectedBook, setSelectedBook] = useState(null); // For storing selected book
    const [action, setAction] = useState(''); // For storing action type ('borrow' or 'remove')

    const booksPerPage = 5;

    useEffect(() => {
        const fetchUserAndBooks = async () => {
            setLoading(true);
            setError('');
            try {
                const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUser(userResponse.data);

                const booksResponse = await axios.get(
                    `http://localhost:5000/api/books/paginated?page=${currentPage}&limit=${booksPerPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (Array.isArray(booksResponse.data.books)) {
                    setBooks(booksResponse.data.books);
                    setTotalPages(booksResponse.data.totalPages);
                } else {
                    throw new Error('Books data is not an array');
                }
            } catch (error) {
                setError('Error fetching user details or books');
                console.error('Error details:', error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndBooks();
    }, [userId, currentPage]);

    const handleBorrowBook = (book) => {
        setSelectedBook(book);
        setAction('borrow');
        setShowModal(true);
    };

    const handleRemoveBook = async (borrowedBookId) => {
        setLoading(true);
        setError('');
        try {
            await axios.post(
                `http://localhost:5000/api/users/${userId}/remove-book`,
                { borrowedBookId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            const updatedUserResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(updatedUserResponse.data);
        } catch (error) {
            setError('Error removing book');
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Status code:', error.response.status);
            } else {
                console.error('Error message:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmAction = async () => {
        if (!selectedBook) return;
        setLoading(true);
        setError('');
        try {
            if (action === 'borrow') {
                await axios.post(
                    `http://localhost:5000/api/users/${userId}/borrow`,
                    { bookId: selectedBook._id },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
            } else if (action === 'remove') {
                await handleRemoveBook(selectedBook._id);
            }
            const updatedUserResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(updatedUserResponse.data);
            setShowModal(false);
        } catch (error) {
            setError(action === 'borrow' ? 'Error borrowing book' : 'Error removing book');
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Status code:', error.response.status);
            } else {
                console.error('Error message:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>No user found.</div>;

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
                                        {entry.book ? entry.book.title : 'Unknown Book'} 
                                        (Due: {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : 'N/A'})
                                        <button onClick={() => {
                                            setSelectedBook(entry.book);
                                            setAction('remove');
                                            setShowModal(true);
                                        }}>Remove Book</button>
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
                                        <button onClick={() => handleBorrowBook(book)}>Borrow</button>
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

            {/* Modal for Confirming Action */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{action === 'borrow' ? 'Confirm Borrowing' : 'Confirm Removal'}</h2>
                        <p>
                            {action === 'borrow' 
                                ? `Are you sure you want to borrow the book "${selectedBook.title}" by ${selectedBook.author}?`
                                : `Are you sure you want to remove the book "${selectedBook.title}" from your borrowed list?`
                            }
                        </p>
                        <button onClick={confirmAction}>Confirm</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetailPage;
