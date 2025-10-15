const express = require('express');
const router = express.Router();
const Pick = require('../models/Pick');
const League = require('../models/League');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/picks
// @desc    Submit a user's weekly picks for a league
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { leagueId, week, players } = req.body;
    const userId = req.user.id;

    // 1. Basic validation
    if (!leagueId || !week || !players) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // 2. Verify the user is a member of the league
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: 'League not found.' });
    }
    const isMember = league.members.some(memberId => memberId.equals(userId));
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this league.' });
    }

    // 3. Prevent duplicate picks for the same week
    const existingPick = await Pick.findOne({ user: userId, league: leagueId, week });
    if (existingPick) {
      return res.status(400).json({ message: 'You have already submitted picks for this week.' });
    }

    // 4. Create and save the new pick
    const newPick = new Pick({
      user: userId,
      league: leagueId,
      week,
      players,
    });

    const savedPick = await newPick.save();
    res.status(201).json(savedPick);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while submitting picks.' });
  }
});
// @route   GET /api/picks/league/:leagueId/week/:week
// @desc    Get leaderboard for a specific league and week
// @access  Private
router.get('/league/:leagueId/week/:week', protect, async (req, res) => {
  try {
    const { leagueId, week } = req.params;

    // Security check: Ensure the requesting user is a member of the league
    const league = await League.findById(leagueId);
    if (!league || !league.members.some(memberId => memberId.equals(req.user.id))) {
      return res.status(403).json({ message: 'User is not a member of this league.' });
    }

    // Find all picks, populate user's name, and sort by score
    const picks = await Pick.find({ league: leagueId, week: week })
      .populate('user', 'username')
      .sort({ totalScore: -1 }); // -1 for descending order (highest first)

    res.json(picks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/picks/mypicks/league/:leagueId/week/:week
// @desc    Get the logged-in user's picks for a specific league and week
// @access  Private
router.get('/mypicks/league/:leagueId/week/:week', protect, async (req, res) => {
  try {
    const { leagueId, week } = req.params;
    const userId = req.user.id;

    const pick = await Pick.findOne({
      user: userId,
      league: leagueId,
      week: week,
    });

    if (!pick) {
      // It's not an error if no picks are found, just means they haven't picked yet
      return res.status(404).json({ message: 'No picks found for this week.' });
    }

    res.json(pick);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;
