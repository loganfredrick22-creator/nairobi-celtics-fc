const express = require('express');
const router = express.Router();
const { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } = require('../controllers/playerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPlayers);
router.get('/:id', getPlayer);
router.post('/', protect, admin, createPlayer);
router.put('/:id', protect, admin, updatePlayer);
router.delete('/:id', protect, admin, deletePlayer);

module.exports = router;
