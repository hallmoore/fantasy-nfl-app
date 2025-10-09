const express = require('express');
const router = express.Router();
const League = require('../models/League');
const { protect } = require('../middleware/authMiddleware');

// GET all leagues (public)
router.get('/', async (req, res) => {
  try {
    const leagues = await League.find().populate('commissioner', 'username').sort({ createdAt: -1 });
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching leagues.' });
  }
});

// GET leagues for the logged-in user (private)
router.get('/myleagues', protect, async (req, res) => {
  try {
    const leagues = await League.find({ members: req.user.id }).populate('commissioner', 'username').sort({ createdAt: -1 });
    res.json(leagues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching leagues.' });
  }
});

// POST to create a league (private)
router.post('/create', protect, async (req, res) => {
  // ... create league logic ...
});

// PUT to join a league (private)
router.put('/:leagueId/join', protect, async (req, res) => {
  // ... join league logic ...
});

module.exports = router;
