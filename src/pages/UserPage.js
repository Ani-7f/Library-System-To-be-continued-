import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/UserPage.css';

const UserPage = ({ onLogout }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure the token is included if authentication is required
                    }
                });
                setUsers(response.data);
            } catch (error) {
                setError('Error fetching users');
                console.error('Error fetching users:', error.response ? error.response.data : error.message);
            }
        };

        fetchUsers();
    }, []);

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
            <main className="main-content">
                <h2 className="section-title">Users</h2>
                {error && <p className="error-message">{error}</p>}
                {users.length === 0 ? (
                    <p className="loading-message">Loading...</p>
                ) : (
                    <ul className="user-list">
                        {users.map(user => (
                            <li key={user._id} className="user-list-item">
                                <span>{user.name}</span>
                                <Link to={`/users/${user._id}`} className="view-details-link">View Details</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default UserPage;
