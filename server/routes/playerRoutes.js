const express = require('express');
const router = express.Router();
const axios = require('axios');

// Simple in-memory cache
let playerCache = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// @route   GET /api/players
// @desc    Get all NFL players from Sleeper API with caching
// @access  Public
router.get('/', async (req, res) => {
  const now = Date.now();

  // Check if cache is still valid
  if (playerCache.data && (now - playerCache.timestamp < CACHE_DURATION)) {
    return res.json(playerCache.data);
  }

  try {
    // Fetch data from Sleeper API
    const response = await axios.get('https://api.sleeper.app/v1/players/nfl');
    const players = response.data;

    // Update cache
    playerCache = {
      data: players,
      timestamp: now,
    };

    res.json(players);

  } catch (error) {
    console.error('Failed to fetch players from Sleeper API:', error);
    res.status(500).json({ message: 'Failed to fetch player data.' });
  }
});

module.exports = router;
