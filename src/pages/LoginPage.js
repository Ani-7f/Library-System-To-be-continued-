import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/LoginPage.css';

const LoginPage = ({ setLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const url = isRegistering ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
            const body = isRegistering
                ? JSON.stringify({ name, username, email, password })
                : JSON.stringify({ email, password });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setLoggedIn(true);
                navigate('/Home'); // Redirect to home page
            } else {
                setError(data.message || 'Operation failed!');
            }
        } catch (error) {
            console.error('Error during login/registration:', error);
            setError('Error during operation! Please try again later.');
        }
    };

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
        <div className="login-container">
            <div className="login-welcome">
                <h2>Welcome to the Staff Portal</h2>
                <p>Please login or register to access your account and manage library resources efficiently.</p>
            </div>
            <div className="login-form">
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn-primary">{isRegistering ? 'Register' : 'Login'}</button>
                </form>
                <button onClick={() => setIsRegistering(!isRegistering)} className="btn-secondary">
                    {isRegistering ? 'Already have an account? Login' : 'New user? Register here'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;
