const Booking = require('../models/Booking');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const createTourBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, type: 'tour' });
    sendSuccess(res, { booking }, 'Tour booking submitted', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const createHospitalityBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, type: 'hospitality' });
    sendSuccess(res, { booking }, 'Hospitality enquiry submitted', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const createAcademyApplication = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, type: 'academy' });
    sendSuccess(res, { booking }, 'Academy application submitted', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { createTourBooking, createHospitalityBooking, createAcademyApplication };
