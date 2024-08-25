import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StaffPage from './pages/StaffPage';
import UserPage from './pages/UserPage';
import UserDetailPage from './pages/UserDetailPage';
import BookListPage from './pages/BookListPage';
import LoginPage from './pages/LoginPage';
import BookDetailsPage from './pages/BookDetailsPage';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token); // Check if the token is present and update login state
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    window.location.href = '/Login'; // Redirect to login page
  };

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={loggedIn ? <Navigate to="/Home" /> : <LoginPage setLoggedIn={setLoggedIn} />} />
        <Route path="/Home" element={loggedIn ? <HomePage onLogout={handleLogout} /> : <Navigate to="/Login" />} />
        <Route path="/Staff" element={loggedIn ? <StaffPage onLogout={handleLogout} /> : <Navigate to="/Login" />} />
        <Route path="/Users" element={loggedIn ? <UserPage onLogout={handleLogout} /> : <Navigate to="/Login" />} />
        <Route path="/users/:userId" element={loggedIn ? <UserDetailPage onLogout={handleLogout} /> : <Navigate to="/Login" />} /> 
        <Route path="/Books" element={loggedIn ? <BookListPage onLogout={handleLogout} /> : <Navigate to="/Login" />} />
        <Route path="/Books/:id" element={loggedIn ? <BookDetailsPage onLogout={handleLogout} /> : <Navigate to="/Login" />} />
        <Route path="*" element={<Navigate to={loggedIn ? "/Home" : "/Login"} />} /> {/* Redirect any unknown routes */}
      </Routes>
    </Router>
  );
};

export default App;
