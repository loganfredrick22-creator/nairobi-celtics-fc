const express = require('express');
const router = express.Router();
const { getAvailableMatches, getMatchSeatAvailability, purchaseTickets, payTicket, getTicketByRef, getUserTickets } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.get('/matches', getAvailableMatches);
router.get('/matches/:id', getMatchSeatAvailability);
router.post('/', purchaseTickets);
router.post('/:bookingRef/pay', payTicket);
router.get('/:bookingRef', getTicketByRef);
router.get('/user/:userId', protect, getUserTickets);

module.exports = router;
