const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('./models/Product');
const Fixture = require('./models/Fixture');
const News = require('./models/News');
const Season = require('./models/Season');
const Player = require('./models/Player');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nairobi-celtics-fc';

const products = [
  { name: 'Nairobi Celtis Home Jersey 2025/26', slug: 'home-jersey-2025-26', category: 'kit', price: 6500, salePrice: 5500, onSale: true, isNew: true, images: ['/images/kit-home.jpg'], sizes: [{ size: 'S', stock: 50 }, { size: 'M', stock: 80 }, { size: 'L', stock: 100 }, { size: 'XL', stock: 60 }], totalStock: 290, featured: true, description: 'Official home jersey. Wear the green with pride.' },
  { name: 'Nairobi Celtis Away Kit 2025/26', slug: 'away-kit-2025-26', category: 'kit', price: 6500, salePrice: null, onSale: false, isNew: true, images: ['/images/kit-away.jpg'], sizes: [{ size: 'S', stock: 40 }, { size: 'M', stock: 70 }, { size: 'L', stock: 80 }, { size: 'XL', stock: 50 }], totalStock: 240, featured: true, description: 'Striking white away kit with green accents.' },
  { name: 'Training Shorts', slug: 'training-shorts', category: 'training', price: 2500, salePrice: 2000, onSale: true, isNew: false, images: ['/images/training-kit.jpg'], sizes: [{ size: 'S', stock: 50 }, { size: 'M', stock: 80 }, { size: 'L', stock: 80 }, { size: 'XL', stock: 40 }], totalStock: 250, featured: false, description: 'Lightweight training shorts with club crest.' },
  { name: 'Official Club Cap', slug: 'club-cap', category: 'accessory', price: 1800, salePrice: null, onSale: false, isNew: false, images: ['/images/cap.jpg'], sizes: [{ size: 'One Size', stock: 150 }], totalStock: 150, featured: false, description: 'Adjustable cap with embroidered NCFC logo.' },
  { name: 'Official Scarf', slug: 'official-scarf', category: 'accessory', price: 2000, salePrice: 1500, onSale: true, isNew: false, images: ['/images/scarf.jpg'], sizes: [{ size: 'One Size', stock: 200 }], totalStock: 200, featured: true, description: 'Green and black woven scarf with club crest.' },
  { name: 'Gym Bag', slug: 'gym-bag', category: 'accessory', price: 3500, salePrice: null, onSale: false, isNew: false, images: ['/images/bag.jpg'], sizes: [{ size: 'One Size', stock: 80 }], totalStock: 80, featured: false, description: 'Duffel bag with shoe compartment. Pro-grade.' },
  { name: 'Training Jacket', slug: 'training-jacket', category: 'training', price: 5500, salePrice: null, onSale: false, isNew: false, images: ['/images/jacket.jpg'], sizes: [{ size: 'S', stock: 25 }, { size: 'M', stock: 40 }, { size: 'L', stock: 45 }, { size: 'XL', stock: 30 }], totalStock: 140, featured: false, description: 'Water-resistant zip-up training jacket.' },
  { name: 'Club Hoodie', slug: 'club-hoodie', category: 'accessory', price: 5000, salePrice: 4200, onSale: true, isNew: false, images: ['/images/jacket.jpg'], sizes: [{ size: 'S', stock: 35 }, { size: 'M', stock: 55 }, { size: 'L', stock: 60 }, { size: 'XL', stock: 35 }], totalStock: 185, featured: true, description: 'Premium heavyweight hoodie with Celtics crest.' },
];

const opponents = [
  'Gor Mahia', 'AFC Leopards', 'Tusker FC', 'Bandari FC', 'KCB FC',
  'Sofapaka', 'Mathare United', 'Ulinzi Stars', 'Posta Rangers',
  'Wazito FC', 'Muranga SEAL', 'Talanta FC', 'Kariobangi Sharks',
  'Kakamega Homeboyz', 'Bidco United', 'Nzoia Sugar', 'FC Talanta',
];

const generateFixtures = () => {
  const fixtures = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const matchDate = new Date(now);
    matchDate.setDate(matchDate.getDate() + (i * 14) + 7);
    matchDate.setHours(15, 0, 0, 0);
    const opponent = opponents[i % opponents.length];
    fixtures.push({
      opponent,
      competition: 'FKF Premier League',
      venue: 'home',
      stadium: 'Nairobi Celtics Stadium',
      date: matchDate,
      kickoff: '15:00',
      status: 'scheduled',
      season: '2025-26',
      matchday: 20 + i,
      isHomeGame: true,
      ticketAvailable: true,
      ticketTiers: [
        { name: 'General', price: 500, capacity: 15000, available: 12000 },
        { name: 'VIP', price: 1500, capacity: 2000, available: 1800 },
        { name: 'VVIP', price: 3000, capacity: 500, available: 450 },
      ],
    });
  }
  return fixtures;
};

const articles = [
  { title: 'Celtics Crush Gor Mahia 3-0 in FKF Derby', slug: 'celtics-crush-gor-mahia-3-0', excerpt: 'A dominant display at the fortress sees Celtics go top of the table with a comprehensive victory over rivals Gor Mahia.', content: 'Nairobi Celtics FC delivered a masterclass performance at the Nairobi Celtics Stadium, dismantling arch-rivals Gor Mahia 3-0 in front of a record crowd of 45,000 fans. Daniel Mutua opened the scoring in the 23rd minute with a clinical finish from inside the box. Kevin Ochieng doubled the lead just before halftime with a spectacular volley from 25 yards. Joseph Barasa sealed the victory in the 67th minute, rounding off a swift counter-attack. The win propels Celtics to the top of the FKF Premier League standings with 48 points from 18 matches. Head coach praised the team\'s discipline and execution, saying, "This is what we work for every day. The fans deserve this performance and we will keep pushing." The team now looks ahead to next week\'s fixture against AFC Leopards.', category: 'Match Report', author: 'Nairobi Celtis Media', thumbnail: '/images/news-1.jpg', featured: true, publishedAt: new Date('2025-10-15') },
  { title: 'Celtics Complete Signing of Kenyan International', slug: 'celtics-sign-kenyan-international', excerpt: 'Nairobi Celtics FC is delighted to announce the signing of highly-rated Kenyan international midfielder in a record transfer deal.', content: 'Nairobi Celtics FC has completed the signing of Kenyan international midfielder Collins Otieno from AFC Leopards on a four-year deal. The 27-year-old, who has 14 caps for the Kenya national team, joins for a club-record fee. "This is a dream move," said Otieno during his unveiling at the club\'s training complex. "Nairobi Celtics is the biggest club in Kenya right now, and I want to help bring trophies to this passionate fanbase. The project here is exciting and I cannot wait to get started." Head Coach praised the signing, calling Otieno "a game-changer who will add immense quality to our midfield." The midfielder is expected to make his debut in the upcoming fixture against Tusker FC.', category: 'Transfer News', author: 'Nairobi Celtis Media', thumbnail: '/images/news-2.jpg', featured: true, publishedAt: new Date('2025-09-28') },
  { title: 'Academy Star Signs First Professional Contract', slug: 'academy-graduate-first-pro-contract', excerpt: '18-year-old sensation Emmanuel Kipchumba has signed his first professional contract with Nairobi Celtics FC.', content: 'Nairobi Celtics Academy product Emmanuel Kipchumba has signed his first professional contract, committing to the club until 2028. The attacking midfielder, who has been with the Celtics Academy since the age of 10, made his first-team debut last season and impressed with his composure and vision. "This is everything I have worked for since I was a kid," said Kipchumba at the signing ceremony. "Wearing the Celtics green is an honor, and I will give everything for this club and its fans." Kipchumba is regarded as one of the brightest prospects in Kenyan football, drawing comparisons to some of the greats who have come through the academy system.', category: 'Club News', author: 'Nairobi Celtis Media', thumbnail: '/images/news-3.jpg', featured: false, publishedAt: new Date('2025-09-20') },
  { title: 'Celtics Women\'s Team Set for Inaugural Season', slug: 'celtics-women-launch-inaugural-season', excerpt: 'Nairobi Celtics FC Women\'s team officially launches its inaugural season in the Kenya Women\'s Premier League.', content: 'Nairobi Celtics FC is proud to announce the launch of its women\'s team, who will compete in the Kenya Women\'s Premier League starting next season. The team will be based at the Celtics Training Campus and will play home matches at the Mini Stadium. "Football is for everyone, and we are committed to growing the women\'s game in Kenya," said the club chairman at the launch event. "We have assembled a talented squad and experienced coaching staff, and we believe Celtics Women can compete at the highest level from day one." The club will hold open trials next month at the training campus.', category: 'Club News', author: 'Nairobi Celtis Media', thumbnail: '/images/news-5.jpg', featured: false, publishedAt: new Date('2025-11-15') },
  { title: 'Stadium Expansion Plans Unveiled for 100K Capacity', slug: 'stadium-expansion-plans-unveiled', excerpt: 'Nairobi Celtics FC unveils ambitious plans to expand the Main Stadium to 100,000 capacity.', content: 'Nairobi Celtics FC has unveiled ambitious plans to expand the Main Stadium from its current 88,500 capacity to 100,000, making it the largest stadium in East Africa. The expansion project, estimated to cost KES 5 billion, includes a new upper tier on the east stand, additional corporate boxes, and state-of-the-art facilities. Construction is expected to begin in June 2026 and be completed by August 2027. During the construction period, the club will play some home matches at alternative venues. "This expansion reflects our ambition to become a top-tier club in Africa," said the club CEO at the press conference.', category: 'Club News', author: 'Nairobi Celtis Media', thumbnail: '/images/news-6.jpg', featured: true, publishedAt: new Date('2025-10-30') },
];

const standingsData = [
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

async function seedCollection(Model, name, data, transform) {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`SKIP: ${name} — ${count} documents already exist`);
    return;
  }
  const docs = transform ? data.map(transform) : data;
  await Model.insertMany(docs);
  console.log(`SEEDED: ${name} — ${docs.length} documents`);
}

async function seedAll() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log(`Connected: ${mongoose.connection.host}\n`);

    await seedCollection(Product, 'Products', products);

    await seedCollection(Fixture, 'Fixtures', generateFixtures(), (f) => ({
      ...f,
      result: { homeScore: null, awayScore: null, outcome: null },
    }));

    await seedCollection(News, 'News', articles);

    await seedCollection(Season, 'Season', [{ season: '2025-26', competition: 'FKF Premier League' }], (s) => ({
      ...s,
      standings: standingsData.map((c) => ({
        club: c.club,
        played: c.p,
        won: c.w,
        drawn: c.d,
        lost: c.l,
        goalsFor: c.gf,
        goalsAgainst: c.ga,
        goalDifference: c.gf - c.ga,
        points: c.w * 3 + c.d,
        form: Array.from({ length: 5 }, () => ['W', 'D', 'L'][Math.floor(Math.random() * 3)]),
      })),
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
    }));

    const adminCount = await User.countDocuments({ email: 'admin@nairoliceltics.co.ke' });
    if (adminCount === 0) {
      await User.create({
        firstName: 'Admin',
        lastName: 'NCFC',
        email: 'admin@nairoliceltics.co.ke',
        password: 'Admin@123',
        phone: '+254700000000',
        role: 'admin',
      });
      console.log('SEEDED: Admin user — admin@nairoliceltics.co.ke / Admin@123');
    } else {
      console.log('SKIP: Admin user — already exists');
    }

    console.log('\nAll seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAll();
