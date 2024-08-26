import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/UserPage.css';

const UserPage = ({ onLogout }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(4); // Number of users per page
    const [totalUsers, setTotalUsers] = useState(0); // Track total number of users for pagination

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        page: currentPage,
                        limit: usersPerPage
                    }
                });

                setUsers(response.data.users); // Adjust based on your actual data structure
                setTotalUsers(response.data.total); // Adjust based on API providing total number of users
            } catch (error) {
                setError('Error fetching users');
                console.error('Error fetching users:', error.response ? error.response.data : error.message);
            }
        };

        fetchUsers();
    }, [currentPage, usersPerPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    return (
        <div className="container">
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
            <main className="main-content">
                <h1 className="section-title">Users</h1>
                {error && <p className="error-message">{error}</p>}
                {users.length > 0 ? (
                    <>
                        <ul className="user-list">
                            {users.map(user => (
                                <li key={user._id} className="user-list-item">
                                    <span>{user.name}</span>
                                    <Link to={`/users/${user._id}`} className="view-details-link">View Details</Link>
                                </li>
                            ))}
                        </ul>
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {3}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || users.length < usersPerPage}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    currentPage === 1 ? <p>No users found.</p> : null
                )}
            </main>
        </div>
    );
};

export default UserPage;
