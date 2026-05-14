const mongoose = require('mongoose');
const Fixture = require('../models/Fixture');

const opponents = [
  'Gor Mahia', 'AFC Leopards', 'Tusker FC', 'Bandari FC', 'KCB FC',
  'Sofapaka', 'Mathare United', 'Ulinzi Stars', 'Posta Rangers',
  'Wazito FC', 'Muranga SEAL', 'Talanta FC', 'Kariobangi Sharks',
  'Kakamega Homeboyz', 'Bidco United', 'Nzoia Sugar', 'FC Talanta'
];

const generateResult = () => {
  const outcomes = ['W', 'D', 'L'];
  const outcome = outcomes[Math.floor(Math.random() * 3)];
  if (outcome === 'W') {
    const gf = Math.floor(Math.random() * 4) + 1;
    const ga = Math.floor(Math.random() * gf);
    return { homeScore: gf, awayScore: ga, outcome: 'W' };
  } else if (outcome === 'D') {
    const s = Math.floor(Math.random() * 3);
    return { homeScore: s, awayScore: s, outcome: 'D' };
  } else {
    const ga = Math.floor(Math.random() * 4) + 1;
    const gf = Math.floor(Math.random() * ga);
    return { homeScore: gf, awayScore: ga, outcome: 'L' };
  }
};

const generateFixtures = () => {
  const fixtures = [];
  const now = new Date();

  for (let i = 0; i < 34; i++) {
    const isHome = Math.random() > 0.5;
    const opponent = opponents[i % opponents.length];
    const isPast = i < 20;
    const matchDate = new Date(now);
    matchDate.setDate(matchDate.getDate() + (isPast ? - (20 - i) * 7 : (i - 19) * 7));
    matchDate.setHours(15, 0, 0, 0);

    let competition = 'KSL';
    if (i >= 26) competition = 'Kenyan Cup';
    if (i >= 30) competition = 'CAF CL';

    const fixture = {
      opponent,
      competition,
      venue: isHome ? 'home' : 'away',
      stadium: isHome ? 'Nairobi Celtics Stadium' : `${opponent} Stadium`,
      date: matchDate,
      kickoff: '15:00',
      status: isPast ? 'completed' : 'scheduled',
      result: isPast ? generateResult() : { homeScore: null, awayScore: null, outcome: null },
      season: '2025-26',
      matchday: i + 1,
      isHomeGame: isHome,
      ticketAvailable: isHome && !isPast,
    };

    fixtures.push(fixture);
  }
  return fixtures;
};

const seedFixtures = async () => {
  const count = await Fixture.countDocuments();
  if (count > 0) { console.log(`Fixtures skipped: ${count} already exist`); return; }
  const fixtures = generateFixtures();
  await Fixture.insertMany(fixtures);
  console.log(`Fixtures seeded: ${fixtures.length} fixtures`);
};

module.exports = seedFixtures;
