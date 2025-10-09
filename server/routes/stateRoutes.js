const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/state/nfl
// @desc    Get the current NFL state (includes current week)
// @access  Public
router.get('/nfl', async (req, res) => {
  try {
    const response = await axios.get('https://api.sleeper.app/v1/state/nfl');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch NFL state.' });
  }
});

module.exports = router;
