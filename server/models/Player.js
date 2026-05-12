const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    jerseyNumber: { type: Number, required: true },
    position: {
      type: String,
      enum: ['GK', 'DEF', 'MID', 'FWD'],
      required: true,
    },
    team: { type: String, enum: ['men', 'women', 'academy'], default: 'men' },
    nationality: { type: String, default: 'Kenya' },
    dateOfBirth: { type: Date },
    height: { type: Number },
    weight: { type: Number },
    image: { type: String, default: '/images/player-1.jpg' },
    stats: {
      appearances: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      rating: { type: Number, default: 0, min: 0, max: 10 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
    },
    career: [
      {
        club: String,
        years: String,
        appearances: Number,
        goals: Number,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);
