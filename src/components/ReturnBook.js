import React from 'react';
import axios from 'axios';

const ReturnBook = ({ userId, bookId }) => {
    const handleReturn = async () => {
        try {
            await axios.post(`http://localhost:5000/api/return/${userId}/${bookId}`);
            alert('Book returned successfully');
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    return <button onClick={handleReturn}>Return</button>;
};

export default ReturnBook;
