const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the blueprint for a "User" in our database.
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // No two users can have the same username
    trim: true,   // Removes whitespace from both ends
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
    // IMPORTANT: We will hash this password before saving it!
  }
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// This creates the model from the schema and exports it.
const User = mongoose.model('User', userSchema);

module.exports = User;
