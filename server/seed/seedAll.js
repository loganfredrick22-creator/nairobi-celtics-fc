const mongoose = require('mongoose');
const config = require('../config/env');
const seedPlayers = require('./seedPlayers');
const seedFixtures = require('./seedFixtures');
const seedProducts = require('./seedProducts');
const seedNews = require('./seedNews');
const seedSeason = require('./seedSeason');
const seedAdmin = require('./seedAdmin');

const seedAll = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    await seedAdmin();
    await seedPlayers();
    await seedFixtures();
    await seedProducts();
    await seedNews();
    await seedSeason();

    console.log('\nAll data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAll();
