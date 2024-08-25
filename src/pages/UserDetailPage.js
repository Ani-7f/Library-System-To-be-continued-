import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const UserDetailPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

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

                // Fetch all books
                const booksResponse = await axios.get('http://localhost:5000/api/books', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBooks(booksResponse.data);
            } catch (error) {
                setError('Error fetching user details or books');
                console.error('Error fetching user details or books:', error.message || error);
            }
        };

        fetchUserAndBooks();
    }, [userId]);

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
            console.error('Error borrowing book:', error.message || error);
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
            console.error('Error marking fine as paid:', error.message || error);
        }
    };

    if (error) return <div>{error}</div>;
    if (!user || books.length === 0) return <div>Loading...</div>;

    const borrowedBooks = user.borrowedBooks || [];

    return (
        <div>
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

            <h2>Available Books</h2>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        {book.title} - {book.author}
                        <button onClick={() => handleBorrowBook(book._id)}>Borrow</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserDetailPage;
