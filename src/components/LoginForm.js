import React, { useState } from 'react'; // Import React and useState
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../CSS/LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState(''); // Initialize email state
    const [password, setPassword] = useState(''); // Initialize password state
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            const user = response.data;
            navigate(`/user/${user.id}`); // Use navigate instead of history.push
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
