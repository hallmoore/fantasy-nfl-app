const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const updateAllScores = require('../scripts/updateScores');

router.post('/update', protect, async (req, res) => {
  // Get the week from the request body
  const { week } = req.body; 

  if (!week) {
    return res.status(400).json({ message: 'Week number is required.' });
  }

  console.log(`Manual score update triggered by user for week ${week}.`);
  updateAllScores(week); // Pass the week to the script

  res.status(202).json({ message: `Score update process has been started for week ${week}.` });
});

module.exports = router;