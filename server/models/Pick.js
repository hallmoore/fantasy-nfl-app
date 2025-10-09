const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pickSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League',
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  players: {
    type: [String], // An array of player IDs from the external NFL API
    required: true,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Pick = mongoose.model('Pick', pickSchema);

module.exports = Pick;
