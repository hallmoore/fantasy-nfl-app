const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/stats/:year/:week
// @desc    Get all player stats for a specific week
// @access  Public
router.get('/:year/:week', async (req, res) => {
  try {
    const { year, week } = req.params;
    const statsRes = await axios.get(`https://api.sleeper.app/v1/stats/nfl/regular/${year}/${week}`);
    res.json(statsRes.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weekly stats.' });
  }
});

module.exports = router;
