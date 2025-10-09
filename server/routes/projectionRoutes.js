const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/projections/:year/:week
// @desc    Get all player projections for a specific week
// @access  Public
router.get('/:year/:week', async (req, res) => {
  try {
    const { year, week } = req.params;
    const projectionsRes = await axios.get(`https://api.sleeper.app/v1/projections/nfl/regular/${year}/${week}`);
    res.json(projectionsRes.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weekly projections.' });
  }
});

module.exports = router;
