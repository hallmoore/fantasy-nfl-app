const jwt = require('jsonwebtoken'); // Make sure to import this at the top of the file
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model we created

// --- REGISTRATION ROUTE ---
// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // 1. Get username, email, and password from the request body
    const { username, email, password } = req.body;

    // 2. Simple validation: Check if fields are missing
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // 3. Check if a user with that email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email or username already exists.' });
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create a new User instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // 6. Save the new user to the database
    const savedUser = await newUser.save();

    // 7. Respond with the created user (excluding the password)
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// --- LOGIN ROUTE ---
// @route   POST /api/users/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // 1. Get email and password from the request body
    const { email, password } = req.body;

    // 2. Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // 3. Check if a user with that email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 4. Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 5. User is valid, create a JSON Web Token (JWT)
    const payload = {
      id: user.id,
      username: user.username,
    };

    // You must add a JWT_SECRET to your Replit Secrets!
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // 6. Respond with the token and user info (excluding password)
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
