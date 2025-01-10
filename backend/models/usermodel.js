// models/User.js
const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    division: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Create the User model
const Useryfc = mongoose.model('Useryfc', userSchema);

module.exports = Useryfc;
