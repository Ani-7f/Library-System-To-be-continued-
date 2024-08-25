// hashPasswords.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Staff = require('./models/Staff'); // Adjust the path as needed

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');

    // Fetch all users
    const users = await Staff.find({});

    // Iterate over each user and hash their password
    for (let user of users) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Update the user with the hashed password
        await Staff.updateOne({ _id: user._id }, { password: hashedPassword });
        
        console.log(`Updated user ${user.username} with hashed password.`);
    }

    console.log('Password hashing complete.');

    // Close the MongoDB connection
    mongoose.connection.close();
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
