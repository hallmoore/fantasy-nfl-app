// This object defines the point value for each stat.
// We are using stat names that are common in fantasy football APIs.
const SCORING_RULES = {
  // Passing
  pass_yd: 0.04,  // 1 point per 25 passing yards
  pass_td: 4,
  pass_int: -2,
  
  // Rushing
  rush_yd: 0.1,   // 1 point per 10 rushing yards
  rush_td: 6,
  
  // Receiving
  rec: 1,         // 1 point per reception (PPR)
  rec_yd: 0.1,    // 1 point per 10 receiving yards
  rec_td: 6,
  
  // Miscellaneous
  fumble_lost: -2,
  two_pt_conv: 2,
};

/**
 * Calculates a player's total fantasy score based on their stats and a set of rules.
 * @param {object} stats - A player's stats object (e.g., { pass_td: 2, rush_yd: 50 }).
 * @param {object} rules - The scoring rules object.
 * @returns {number} The total fantasy score.
 */
const calculatePlayerScore = (stats, rules) => {
  let totalScore = 0;

  // Loop through each rule (e.g., 'pass_td', 'rush_yd')
  for (const statName in rules) {
    // Check if the player has a value for that stat
    if (stats && stats[statName]) {
      // Calculate the points for that stat and add to the total
      totalScore += stats[statName] * rules[statName];
    }
  }

  return totalScore;
};

// Export both the rules and the function so other files can use them
module.exports = {
  SCORING_RULES,
  calculatePlayerScore,
};
