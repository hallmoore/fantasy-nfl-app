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

module.exports = router;
