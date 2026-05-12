const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, idNumber } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return sendError(res, 'Email already registered', 400);

    const user = await User.create({ firstName, lastName, email, password, phone, idNumber });
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
      accessToken,
    }, 'Registration successful', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
      accessToken,
    }, 'Login successful');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const logout = async (req, res) => {
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  sendSuccess(res, {}, 'Logged out successfully');
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return sendError(res, 'No refresh token', 401);

    const decoded = jwt.verify(token, config.jwtRefreshSecret);
    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, 'User not found', 401);

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch (error) {
    sendError(res, 'Invalid refresh token', 401);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('orderHistory')
      .populate('ticketHistory')
      .populate('savedItems');
    sendSuccess(res, { user }, 'User profile retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { register, login, logout, refresh, getMe };
