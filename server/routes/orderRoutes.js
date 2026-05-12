const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getUserOrders, payOrder, confirmOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.post('/guest', createOrder);
router.get('/:orderId', getOrder);
router.get('/user/:userId', protect, getUserOrders);
router.post('/:orderId/pay', payOrder);
router.post('/:orderId/confirm', protect, confirmOrder);

module.exports = router;
