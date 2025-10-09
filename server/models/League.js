const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leagueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    commissioner: {
      type: Schema.Types.ObjectId,
      ref: "User", // This creates a relationship to the User model
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // An array of references to users in the league
      },
    ],
    // We can add scoring rules or other settings here later
  },
  {
    timestamps: true,
  },
);

const League = mongoose.model("League", leagueSchema);

module.exports = League;
