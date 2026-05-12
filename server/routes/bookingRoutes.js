const express = require('express');
const router = express.Router();
const { createTourBooking, createHospitalityBooking, createAcademyApplication } = require('../controllers/bookingController');

router.post('/tour', createTourBooking);
router.post('/hospitality', createHospitalityBooking);
router.post('/academy', createAcademyApplication);

module.exports = router;
