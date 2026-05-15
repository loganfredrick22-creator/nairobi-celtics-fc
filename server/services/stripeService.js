const config = require('../config/env');

let stripe = null;
try {
  if (config.stripeSecretKey && !config.stripeSecretKey.includes('placeholder')) {
    stripe = require('stripe')(config.stripeSecretKey);
  }
} catch (e) {
  console.warn('Stripe initialization skipped:', e.message);
}

const isReady = () => stripe !== null;

const createPaymentIntent = async (amount, currency, metadata = {}) => {
  if (!isReady()) {
    return { success: false, error: 'Stripe not configured — add STRIPE_SECRET_KEY to .env' };
  }
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'kes',
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    return { success: true, clientSecret: intent.client_secret, id: intent.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const retrievePaymentIntent = async (id) => {
  if (!isReady()) return null;
  try {
    return await stripe.paymentIntents.retrieve(id);
  } catch {
    return null;
  }
};

const generateReceiptUrl = (paymentIntentId) => {
  if (!paymentIntentId) return null;
  return `https://dashboard.stripe.com/test/payments/${paymentIntentId}`;
};

module.exports = { createPaymentIntent, retrievePaymentIntent, generateReceiptUrl, isReady };
