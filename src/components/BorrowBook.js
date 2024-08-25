import React from 'react';
import axios from 'axios';

const BorrowBook = ({ userId, bookId }) => {
    const handleBorrow = async () => {
        try {
            await axios.post(`http://localhost:5000/api/borrow/${userId}/${bookId}`);
            alert('Book borrowed successfully');
        } catch (error) {
            console.error('Error borrowing book:', error);
        }
    };

    return <button onClick={handleBorrow}>Borrow</button>;
};

export default BorrowBook;
