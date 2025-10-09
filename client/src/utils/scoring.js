export const SCORING_RULES = {
  pass_yd: 0.04, pass_td: 4, pass_int: -2,
  rush_yd: 0.1, rush_td: 6,
  rec: 1, rec_yd: 0.1, rec_td: 6,
  fumble_lost: -2, two_pt_conv: 2,
};

export const calculatePlayerScore = (stats, rules) => {
  let totalScore = 0;
  for (const statName in rules) {
    if (stats && stats[statName]) {
      totalScore += stats[statName] * rules[statName];
    }
  }
  // Return the raw number, not a string
  return totalScore; 
};
