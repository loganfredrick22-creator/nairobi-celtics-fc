const Fixture = require('../models/Fixture');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getFixtures = async (req, res) => {
  try {
    const { page = 1, limit = 20, competition, venue, status } = req.query;
    const filter = {};
    if (competition) filter.competition = competition;
    if (venue) filter.venue = venue;
    if (status) filter.status = status;

    const options = { page: parseInt(page), limit: parseInt(limit), sort: { date: -1 } };
    const fixtures = await Fixture.paginate(filter, options);
    sendSuccess(res, { fixtures: fixtures.docs }, 'Fixtures retrieved', 200, {
      page: fixtures.page, limit: fixtures.limit, totalPages: fixtures.totalPages, totalDocs: fixtures.totalDocs,
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getNextFixture = async (req, res) => {
  try {
    const fixture = await Fixture.findOne({ status: 'scheduled', date: { $gte: new Date() } }).sort({ date: 1 });
    if (!fixture) return sendSuccess(res, { fixture: null }, 'No upcoming fixtures');
    sendSuccess(res, { fixture }, 'Next fixture retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getRecentFixtures = async (req, res) => {
  try {
    const fixtures = await Fixture.find({ status: 'completed' }).sort({ date: -1 }).limit(5);
    sendSuccess(res, { fixtures }, 'Recent results retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getFixture = async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id);
    if (!fixture) return sendError(res, 'Fixture not found', 404);
    sendSuccess(res, { fixture }, 'Fixture retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const createFixture = async (req, res) => {
  try {
    const fixture = await Fixture.create(req.body);
    sendSuccess(res, { fixture }, 'Fixture created', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getFixtures, getNextFixture, getRecentFixtures, getFixture, createFixture };
