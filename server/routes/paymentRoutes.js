const express = require('express');
const router = express.Router();
const mpesaService = require('../services/mpesaService');
const Order = require('../models/Order');

router.get('/config', (req, res) => {
  res.json({
    mpesaConfigured: mpesaService.isConfigured(),
    mpesaEnv: process.env.MPESA_ENV || 'sandbox',
  });
});

router.post('/mpesa-stk', async (req, res) => {
  try {
    const { phone, amount, orderNumber } = req.body;
    if (!phone || !amount || !orderNumber) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const result = await mpesaService.stkPush(phone, amount, orderNumber);
    res.json({ success: result.success, checkoutRequestId: result.checkoutRequestId, message: result.message, simulated: result.simulated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/mpesa-callback', async (req, res) => {
  try {
    const { Body } = req.body;
    const orderNumber = req.query.order;

    if (Body?.stkCallback?.ResultCode === 0) {
      const checkoutRequestId = Body.stkCallback.CheckoutRequestID;
      const metadata = Body.stkCallback.CallbackMetadata?.Item || [];
      const mpesaRef = metadata.find((m) => m.Name === 'MpesaReceiptNumber')?.Value || '';
      const phone = metadata.find((m) => m.Name === 'PhoneNumber')?.Value || '';
      const amount = metadata.find((m) => m.Name === 'Amount')?.Value || 0;

      if (orderNumber) {
        const order = await Order.findOne({ orderNumber });
        if (order && order.paymentStatus === 'pending') {
          order.paymentStatus = 'paid';
          order.paymentRef = mpesaRef || `MPESA-${checkoutRequestId.slice(-10)}`;
          order.orderStatus = 'confirmed';
          const deliveryDays = { clickcollect: 0, nairobi: 1, nationwide: 5, eastafrica: 10, international: 21 };
          order.estimatedDelivery = new Date(Date.now() + (deliveryDays[order.deliveryMethod] || 5) * 24 * 60 * 60 * 1000);
          await order.save();

          for (const item of order.items) {
            const Product = require('../models/Product');
            const product = await Product.findById(item.product);
            if (product) {
              const sizeObj = product.sizes.find((s) => s.size === item.size);
              if (sizeObj) sizeObj.stock -= item.quantity;
              product.totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
              await product.save();
            }
          }
        }
      }
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa callback error:', error.message);
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  }
});

module.exports = router;
