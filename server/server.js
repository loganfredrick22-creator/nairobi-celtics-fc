const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Nairobi Celtics FC API running on port ${config.port}`);
  });
};

start();
