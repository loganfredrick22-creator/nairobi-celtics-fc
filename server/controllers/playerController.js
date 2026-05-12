const Player = require('../models/Player');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getPlayers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.team) filter.team = req.query.team;
    if (req.query.position) filter.position = req.query.position;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';

    const players = await Player.find(filter).sort({ jerseyNumber: 1 });
    sendSuccess(res, { players }, 'Players retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return sendError(res, 'Player not found', 404);
    sendSuccess(res, { player }, 'Player retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);
    sendSuccess(res, { player }, 'Player created', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!player) return sendError(res, 'Player not found', 404);
    sendSuccess(res, { player }, 'Player updated');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return sendError(res, 'Player not found', 404);
    sendSuccess(res, {}, 'Player deleted');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer };
