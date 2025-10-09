require('dotenv').config({ path: '../.env' }); // Adjust path to find .env in the root
const mongoose = require('mongoose');
const axios = require('axios');
const Pick = require('../models/Pick');
const { SCORING_RULES, calculatePlayerScore } = require('../utils/scoring');

const updateAllScores = async () => {
  console.log('Starting score update process...');

  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for script.');

    // 2. Get the current NFL week from the Sleeper API
    const stateRes = await axios.get('https://api.sleeper.app/v1/state/nfl');
    const currentWeek = stateRes.data.week;
    console.log(`Current NFL Week: ${currentWeek}`);

    // 3. Fetch all player stats for the current week
    // Note: This endpoint provides stats for completed games. For live, real-time
    // scores, a more complex, often paid, API is needed. This is perfect for our needs.
    const statsRes = await axios.get(`https://api.sleeper.app/v1/stats/nfl/regular/2023/${currentWeek}`);
    const weeklyPlayerStats = statsRes.data;
    console.log(`Fetched stats for ${Object.keys(weeklyPlayerStats).length} players.`);

    // 4. Find all user picks for the current week
    const weeklyPicks = await Pick.find({ week: currentWeek });
    if (weeklyPicks.length === 0) {
      console.log('No user picks found for this week. Exiting.');
      return;
    }
    console.log(`Found ${weeklyPicks.length} user rosters to score.`);

    // 5. Loop through each user's picks, calculate, and update the score
    for (const pick of weeklyPicks) {
      let totalRosterScore = 0;
      
      // Calculate score for each player on the roster
      for (const playerId of pick.players) {
        const playerStats = weeklyPlayerStats[playerId];
        if (playerStats) {
          const playerScore = calculatePlayerScore(playerStats, SCORING_RULES);
          totalRosterScore += playerScore;
        }
      }
      
      // Update the totalScore in the database
      pick.totalScore = totalRosterScore;
      await pick.save();
    }
    
    console.log('Successfully updated all scores for the week.');

  } catch (error) {
    console.error('An error occurred during the score update process:', error.message);
  } finally {
    // 6. Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// Run the main function
updateAllScores();
