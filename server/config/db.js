const mongoose = require('mongoose');
const config = require('./env');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (connectionPromise) return connectionPromise;
  connectionPromise = mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
    .then((conn) => {
      isConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((error) => {
      isConnected = false;
      console.error(`MongoDB connection error: ${error.message}`);
      console.error('Server will start without database — retrying in background...');
      setTimeout(() => {
        connectionPromise = null;
        connectDB();
      }, 30000);
      return null;
    });
  return connectionPromise;
};

connectDB.getStatus = () => isConnected;

module.exports = connectDB;
