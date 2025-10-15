const express = require('express');
const router = express.Router();
const League = require('../models/League');
const { protect } = require('../middleware/authMiddleware');
const Pick = require('../models/Pick');
const mongoose = require('mongoose');

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

// @route   GET /api/leagues/:leagueId
// @desc    Get a single league's details
// @access  Private
router.get('/:leagueId', protect, async (req, res) => {
  try {
    const league = await League.findById(req.params.leagueId)
      .populate('commissioner', 'username') // Get commissioner's username
      .populate('members', 'username');     // Get all members' usernames

    if (!league) {
      return res.status(404).json({ message: 'League not found.' });
    }

    // Security check: Ensure the requesting user is a member of the league
    const isMember = league.members.some(member => member._id.equals(req.user.id));
    if (!isMember) {
      return res.status(403).json({ message: 'User is not a member of this league.' });
    }

    res.json(league);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// @route   GET /api/leagues/:leagueId/season-scores
// @desc    Get the season-long leaderboard for a league
// @access  Private
router.get('/:leagueId/season-scores', protect, async (req, res) => {
  try {
    const { leagueId } = req.params;

    const seasonScores = await Pick.aggregate([
      // 1. Find all picks that match the current league
      { $match: { league: new mongoose.Types.ObjectId(leagueId) } },

      // 2. Group by user and sum their totalScores
      {
        $group: {
          _id: '$user',
          seasonTotal: { $sum: '$totalScore' }
        }
      },

      // 3. Look up the user's details (like username) from the 'users' collection
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },

      // 4. Sort by the season total in descending order
      { $sort: { seasonTotal: -1 } },

      // 5. Format the final output
      {
        $project: {
          _id: 0, // Exclude the default _id field
          userId: '$_id',
          username: { $arrayElemAt: ['$userDetails.username', 0] },
          seasonTotal: 1
        }
      }
    ]);

    res.json(seasonScores);
  } catch (error) {
    console.error('Aggregation Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;
