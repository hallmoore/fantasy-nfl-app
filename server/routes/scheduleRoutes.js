const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/schedule/:week
// @desc    Get NFL schedule for a specific week
// @access  Public
router.get('/:week', async (req, res) => {
  try {
    const week = req.params.week;
    const response = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}`);

    const games = response.data.events;
    const schedule = {};

    games.forEach(game => {
      const homeTeam = game.competitions[0].competitors.find(c => c.homeAway === 'home').team;
      const awayTeam = game.competitions[0].competitors.find(c => c.homeAway === 'away').team;

      // Map each team to its opponent
      schedule[homeTeam.abbreviation] = awayTeam.abbreviation;
      schedule[awayTeam.abbreviation] = homeTeam.abbreviation;
    });

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schedule data.' });
  }
});

module.exports = router;
