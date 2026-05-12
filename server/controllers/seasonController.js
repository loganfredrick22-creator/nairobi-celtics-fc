const Season = require('../models/Season');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getTable = async (req, res) => {
  try {
    const season = await Season.findOne({ competition: 'KSL' }).sort({ createdAt: -1 });
    if (!season) return sendSuccess(res, { standings: [] }, 'No season data yet');
    sendSuccess(res, { standings: season.standings, season: season.season }, 'League table retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getStats = async (req, res) => {
  try {
    const season = await Season.findOne().sort({ createdAt: -1 });
    if (!season) return sendSuccess(res, { stats: {} }, 'No season stats yet');
    sendSuccess(res, { stats: season.stats, season: season.season }, 'Season stats retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getTable, getStats };
