const express = require('express');
const router = express.Router();
const { getTable, getStats } = require('../controllers/seasonController');

router.get('/table', getTable);
router.get('/stats', getStats);

module.exports = router;
