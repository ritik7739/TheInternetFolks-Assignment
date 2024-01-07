const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 64,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 128,
  },
  password: {
    type: String,
    required: true,
    maxLength: 64,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
