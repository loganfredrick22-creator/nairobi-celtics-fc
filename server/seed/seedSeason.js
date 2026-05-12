const Season = require('../models/Season');

const clubs = [
  'Nairobi Celtics FC', 'Gor Mahia', 'AFC Leopards', 'Tusker FC',
  'Bandari FC', 'KCB FC', 'Sofapaka', 'Mathare United',
  'Ulinzi Stars', 'Posta Rangers', 'Wazito FC', 'Muranga SEAL',
  'Talanta FC', 'Kariobangi Sharks', 'Kakamega Homeboyz', 'Bidco United',
];

const seedSeason = async () => {
  await Season.deleteMany({});

  const standings = clubs.map((club, i) => ({
    club,
    played: 20 - i,
    won: 12 - Math.floor(i * 0.6),
    drawn: 5 - Math.floor(i * 0.3),
    lost: 3 + Math.floor(i * 0.4),
    goalsFor: 38 - i * 2,
    goalsAgainst: 12 + i,
    goalDifference: (38 - i * 2) - (12 + i),
    points: (12 - Math.floor(i * 0.6)) * 3 + (5 - Math.floor(i * 0.3)),
    form: ['W', 'W', 'D', 'W', 'L'].map(() => ['W', 'D', 'L'][Math.floor(Math.random() * 3)]),
  }));

  standings.sort((a, b) => b.points - a.points);

  const season = new Season({
    season: '2025-26',
    competition: 'KSL',
    standings,
    stats: {
      totalGoals: 187,
      totalMatches: 76,
      topScorer: 'Daniel Mutua',
      topScorerGoals: 12,
      mostAssists: 'Kevin Ochieng',
      mostAssistsCount: 7,
      cleanSheets: 10,
      winStreak: 5,
    },
  });

  await season.save();
  console.log('Season seeded: KSL standings');
};

module.exports = seedSeason;
