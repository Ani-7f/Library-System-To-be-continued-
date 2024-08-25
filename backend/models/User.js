const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ },
    finesOwed: { type: Number, default: 0 },
    borrowedBooks: [{
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        borrowedDate: { type: Date, default: Date.now },
        dueDate: { type: Date },
        fine: { type: Number, default: 0 }
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
