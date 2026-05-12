const express = require('express');
const router = express.Router();
const { getFixtures, getNextFixture, getRecentFixtures, getFixture, createFixture } = require('../controllers/fixtureController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getFixtures);
router.get('/next', getNextFixture);
router.get('/recent', getRecentFixtures);
router.get('/:id', getFixture);
router.post('/', protect, admin, createFixture);

module.exports = router;
