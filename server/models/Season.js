const mongoose = require('mongoose');

const standingSchema = new mongoose.Schema(
  {
    club: String,
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    drawn: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDifference: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    form: [{ type: String, enum: ['W', 'D', 'L'] }],
  },
  { _id: false }
);

const seasonSchema = new mongoose.Schema(
  {
    season: { type: String, default: '2025-26' },
    competition: { type: String, default: 'KSL' },
    standings: [standingSchema],
    stats: {
      totalGoals: { type: Number, default: 0 },
      totalMatches: { type: Number, default: 0 },
      topScorer: { type: String },
      topScorerGoals: { type: Number, default: 0 },
      mostAssists: { type: String },
      mostAssistsCount: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      winStreak: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Season', seasonSchema);
