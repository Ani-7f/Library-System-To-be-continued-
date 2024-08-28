const mongoose = require('mongoose');
const User = require('./models/User');  // Update the path to your User model

async function updateBorrowedBooks() {
    await mongoose.connect('mongodb://localhost:27017/yourdatabase', { useNewUrlParser: true, useUnifiedTopology: true });

    const users = await User.find({});
    for (let user of users) {
        if (Array.isArray(user.borrowedBooks) && typeof user.borrowedBooks[0] === 'string') {
            user.borrowedBooks = user.borrowedBooks.map(bookId => ({
                book: mongoose.Types.ObjectId(bookId),  // Convert string to ObjectId
                borrowedDate: new Date(),  // Set appropriate borrowedDate
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // Set dueDate, for example
                fine: 0  // Set initial fine
            }));
            
            await user.save();  // Save the updated document
        }
    }

    mongoose.connection.close();
}

updateBorrowedBooks().catch(err => console.error(err));
