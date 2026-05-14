const Season = require('../models/Season');

const clubs = [
  'Nairobi Celtics FC', 'Gor Mahia', 'AFC Leopards', 'Tusker FC',
  'Bandari FC', 'KCB FC', 'Sofapaka', 'Mathare United',
  'Ulinzi Stars', 'Posta Rangers', 'Wazito FC', 'Muranga SEAL',
  'Talanta FC', 'Kariobangi Sharks', 'Kakamega Homeboyz', 'Bidco United',
  'Nzoia Sugar', 'FC Talanta',
];

const formOptions = ['W', 'D', 'L'];

const seedSeason = async () => {
  await Season.deleteMany({});

  const rawStandings = [
    { club: 'Nairobi Celtics FC', p: 24, w: 18, d: 4, l: 2, gf: 52, ga: 14 },
    { club: 'Gor Mahia', p: 24, w: 16, d: 5, l: 3, gf: 44, ga: 18 },
    { club: 'AFC Leopards', p: 24, w: 14, d: 6, l: 4, gf: 38, ga: 20 },
    { club: 'Tusker FC', p: 24, w: 13, d: 5, l: 6, gf: 35, ga: 24 },
    { club: 'Bandari FC', p: 24, w: 12, d: 6, l: 6, gf: 33, ga: 22 },
    { club: 'KCB FC', p: 24, w: 11, d: 7, l: 6, gf: 30, ga: 25 },
    { club: 'Sofapaka', p: 24, w: 10, d: 6, l: 8, gf: 28, ga: 27 },
    { club: 'Mathare United', p: 24, w: 9, d: 5, l: 10, gf: 26, ga: 30 },
    { club: 'Ulinzi Stars', p: 24, w: 8, d: 6, l: 10, gf: 24, ga: 31 },
    { club: 'Kariobangi Sharks', p: 24, w: 8, d: 5, l: 11, gf: 22, ga: 33 },
    { club: 'Posta Rangers', p: 24, w: 7, d: 6, l: 11, gf: 20, ga: 34 },
    { club: 'Wazito FC', p: 24, w: 6, d: 5, l: 13, gf: 18, ga: 36 },
    { club: 'Muranga SEAL', p: 24, w: 5, d: 7, l: 12, gf: 17, ga: 38 },
    { club: 'Talanta FC', p: 24, w: 5, d: 6, l: 13, gf: 16, ga: 39 },
    { club: 'Kakamega Homeboyz', p: 24, w: 4, d: 6, l: 14, gf: 14, ga: 42 },
    { club: 'Bidco United', p: 24, w: 3, d: 8, l: 13, gf: 12, ga: 41 },
    { club: 'Nzoia Sugar', p: 24, w: 3, d: 7, l: 14, gf: 11, ga: 43 },
    { club: 'FC Talanta', p: 24, w: 2, d: 7, l: 15, gf: 9, ga: 46 },
  ];

  const standings = rawStandings.map((s) => {
    const gd = s.gf - s.ga;
    const pts = s.w * 3 + s.d;
    const form = Array.from({ length: 5 }, () => formOptions[Math.floor(Math.random() * 3)]);
    return {
      club: s.club,
      played: s.p,
      won: s.w,
      drawn: s.d,
      lost: s.l,
      goalsFor: s.gf,
      goalsAgainst: s.ga,
      goalDifference: gd,
      points: pts,
      form,
    };
  });

  standings.sort((a, b) => b.points - a.points);

  const season = new Season({
    season: '2025-26',
    competition: 'KSL',
    standings,
    stats: {
      totalGoals: 429,
      totalMatches: 216,
      topScorer: 'Daniel Mutua',
      topScorerGoals: 18,
      mostAssists: 'Kevin Ochieng',
      mostAssistsCount: 11,
      cleanSheets: 14,
      winStreak: 7,
    },
  });

  await season.save();
  console.log('Season seeded: KSL standings (18 teams)');
};

module.exports = seedSeason;
