const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');
const fixtureRoutes = require('./routes/fixtureRoutes');
const newsRoutes = require('./routes/newsRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: [config.clientUrl, config.vercelUrl, 'https://nairobi-celtics-fc-vert.vercel.app'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

app.use('/api/', (req, res, next) => {
  if (req.path === '/health') return next();
  if (!connectDB.getStatus()) {
    return res.status(503).json({ success: false, message: 'Database connection not available. Please try again shortly.' });
  }
  next();
});
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Nairobi Celtics FC API is running',
    dbConnected: connectDB.getStatus(),
  });
});

app.post('/api/seed', async (req, res) => {
  try {
    const seedPlayers = require('./seed/seedPlayers');
    const seedFixtures = require('./seed/seedFixtures');
    const seedProducts = require('./seed/seedProducts');
    const seedNews = require('./seed/seedNews');
    const seedSeason = require('./seed/seedSeason');
    const seedAdmin = require('./seed/seedAdmin');
    await seedAdmin();
    await seedPlayers();
    await seedFixtures();
    await seedProducts();
    await seedNews();
    await seedSeason();
    res.json({ success: true, message: 'Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/season', seasonRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
