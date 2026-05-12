const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtAccessSecret, { expiresIn: '15m' });
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtRefreshSecret, { expiresIn: '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken };
