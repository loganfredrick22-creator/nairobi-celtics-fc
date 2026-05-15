const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const fixtureSchema = new mongoose.Schema(
  {
    opponent: { type: String, required: true },
    competition: {
      type: String,
      enum: ['KSL', 'Kenyan Cup', 'CAF CL', 'Friendly', 'FKF Premier League'],
      required: true,
    },
    venue: { type: String, enum: ['home', 'away', 'neutral'], required: true },
    stadium: { type: String, default: 'Nairobi Celtics Stadium' },
    date: { type: Date, required: true },
    kickoff: { type: String, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'postponed', 'cancelled'],
      default: 'scheduled',
    },
    result: {
      homeScore: { type: Number, default: null },
      awayScore: { type: Number, default: null },
      outcome: { type: String, enum: ['W', 'D', 'L', null], default: null },
    },
    season: { type: String, default: '2025-26' },
    matchday: { type: Number },
    isHomeGame: { type: Boolean, default: true },
    ticketAvailable: { type: Boolean, default: true },
    ticketTiers: [
      {
        name: { type: String, enum: ['General', 'VIP', 'VVIP'] },
        price: { type: Number, required: true },
        capacity: { type: Number },
        available: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

fixtureSchema.index({ date: 1 });
fixtureSchema.index({ status: 1 });
fixtureSchema.index({ competition: 1 });

fixtureSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Fixture', fixtureSchema);
