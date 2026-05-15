const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { generateOrderNumber } = require('../utils/generateBookingRef');
const { simulateCardPayment, simulateMpesaPayment, simulateAirtelPayment, simulatePaypalPayment } = require('../services/paymentService');
const stripeService = require('../services/stripeService');
const { sendOrderConfirmation } = require('../services/emailService');
const { generateReceiptPDF } = require('../services/pdfService');

const createOrder = async (req, res) => {
  try {
    const { items, deliveryMethod, deliveryAddress, paymentMethod, guestEmail } = req.body;
    if (!items || items.length === 0) return sendError(res, 'Cart is empty', 400);

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return sendError(res, `Product not found: ${item.productId}`, 404);
      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (sizeObj && sizeObj.stock < item.quantity) {
        return sendError(res, `Insufficient stock for ${product.name} (${item.size})`, 400);
      }
      const price = product.onSale ? product.salePrice : product.price;
      subtotal += price * item.quantity;
      orderItems.push({ product: product._id, name: product.name, size: item.size, quantity: item.quantity, price });
    }

    const deliveryFees = { clickcollect: 0, nairobi: 350, nationwide: 500, eastafrica: 1500, international: 3500 };
    const deliveryFee = deliveryFees[deliveryMethod] || 0;

    const order = await Order.create({
      user: req.user?._id,
      guestEmail: guestEmail || deliveryAddress?.email,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
    });

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $push: { orderHistory: order._id } });
    }

    sendSuccess(res, { order }, 'Order created', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderId }).populate('items.product');
    if (!order) return sendError(res, 'Order not found', 404);
    sendSuccess(res, { order }, 'Order retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    sendSuccess(res, { orders }, 'User orders retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const payOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderId });
    if (!order) return sendError(res, 'Order not found', 404);
    if (order.paymentStatus === 'paid') return sendError(res, 'Order already paid', 400);

    let paymentResult;
    if (order.paymentMethod === 'mpesa') {
      paymentResult = await simulateMpesaPayment(order.total, req.body.phone);
    } else if (order.paymentMethod === 'airtel') {
      paymentResult = await simulateAirtelPayment(order.total, req.body.phone);
    } else if (order.paymentMethod === 'paypal') {
      paymentResult = await simulatePaypalPayment(order.total);
    } else if (order.paymentMethod === 'card' && stripeService.isReady()) {
      const intentResult = await stripeService.createPaymentIntent(order.total, 'kes', { orderNumber: order.orderNumber });
      if (!intentResult.success) {
        order.paymentStatus = 'failed';
        await order.save();
        return sendError(res, 'Payment service unavailable. Try another method.', 500);
      }
      paymentResult = { success: true, ref: intentResult.id, paymentIntentId: intentResult.id, cardType: 'Stripe', last4: '' };
    } else {
      paymentResult = await simulateCardPayment(order.total, req.body);
    }

    if (paymentResult.success) {
      order.paymentStatus = 'paid';
      order.paymentRef = paymentResult.ref;
      order.orderStatus = 'confirmed';

      if (paymentResult.paymentIntentId) {
        order.paymentIntentId = paymentResult.paymentIntentId;
        order.receiptUrl = stripeService.generateReceiptUrl(paymentResult.paymentIntentId);
      }

      const deliveryDays = { clickcollect: 0, nairobi: 1, nationwide: 5, eastafrica: 10, international: 21 };
      const days = deliveryDays[order.deliveryMethod] || 5;
      order.estimatedDelivery = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      await order.save();

      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const sizeObj = product.sizes.find((s) => s.size === item.size);
          if (sizeObj) sizeObj.stock -= item.quantity;
          product.totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
          await product.save();
        }
      }

      await sendOrderConfirmation(order);
      sendSuccess(res, { order }, 'Payment successful');
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      sendError(res, paymentResult.message, 400);
    }
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderId });
    if (!order) return sendError(res, 'Order not found', 404);
    order.orderStatus = 'confirmed';
    await order.save();
    sendSuccess(res, { order }, 'Order confirmed');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { createOrder, getOrder, getUserOrders, payOrder, confirmOrder };
