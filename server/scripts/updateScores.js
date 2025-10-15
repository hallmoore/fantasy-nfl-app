require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const axios = require('axios');
const Pick = require('../models/Pick');
const { SCORING_RULES, calculatePlayerScore } = require('../utils/scoring');

const updateAllScores = async (weekToUpdate) => {
  console.log('Running score update job...');
  let week;
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // If a specific week is provided, use it. Otherwise, get the current week.
    if (weekToUpdate) {
      week = weekToUpdate;
      console.log(`Updating scores for specific week: ${week}`);
    } else {
      const stateRes = await axios.get('https://api.sleeper.app/v1/state/nfl');
      week = stateRes.data.week;
      console.log(`Updating scores for current week: ${week}`);
    }

    const year = new Date().getFullYear();
    const statsRes = await axios.get(`https://api.sleeper.app/v1/stats/nfl/regular/${year}/${week}`);
    const weeklyPlayerStats = statsRes.data;

    const weeklyPicks = await Pick.find({ week: week });
    if (weeklyPicks.length === 0) {
      console.log(`No user picks found for week ${week}. Job finished.`);
      return;
    }

    for (const pick of weeklyPicks) {
      let totalRosterScore = 0;
      for (const playerId of pick.players) {
        const playerStats = weeklyPlayerStats[playerId];
        if (playerStats) {
          const playerScore = calculatePlayerScore(playerStats, SCORING_RULES);
          totalRosterScore += playerScore;
        }
      }
      pick.totalScore = totalRosterScore;
      await pick.save();
    }

    console.log(`Score update complete for week ${week}.`);

  } catch (error) {
    console.error(`An error occurred during score update for week ${week}:`, error.message);
  }
};

module.exports = updateAllScores;