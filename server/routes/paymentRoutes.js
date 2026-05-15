const express = require('express');
const router = express.Router();
const config = require('../config/env');
const { createPaymentIntent, retrievePaymentIntent, isReady } = require('../services/stripeService');

router.get('/config', (req, res) => {
  res.json({
    publishableKey: config.stripePublishableKey,
    ready: isReady(),
  });
});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, orderNumber } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    const result = await createPaymentIntent(amount, currency || 'kes', { orderNumber });
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }
    res.json({ success: true, clientSecret: result.clientSecret, paymentIntentId: result.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/payment-intent/:id', async (req, res) => {
  try {
    const pi = await retrievePaymentIntent(req.params.id);
    if (!pi) return res.status(404).json({ success: false, message: 'Payment intent not found' });
    res.json({ success: true, paymentIntent: pi });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
