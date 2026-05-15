const axios = require('axios');
const config = require('../config/env');

const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke';
const PROD_BASE = 'https://api.safaricom.co.ke';
const SANDBOX_PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const SANDBOX_SHORTCODE = '174379';

const isConfigured = () => {
  return config.mpesaConsumerKey && config.mpesaConsumerSecret &&
    !config.mpesaConsumerKey.includes('placeholder');
};

let accessToken = null;
let tokenExpiresAt = 0;

const getBaseUrl = () => (config.mpesaEnv === 'production' ? PROD_BASE : SANDBOX_BASE);
const getShortCode = () => (config.mpesaEnv === 'production' ? config.mpesaShortcode || '174379' : SANDBOX_SHORTCODE);
const getPassKey = () => (config.mpesaEnv === 'production' ? config.mpesaPasskey || '' : SANDBOX_PASSKEY);
const getCallbackUrl = () => config.mpesaCallbackUrl || `${config.clientUrl}/api/payments/mpesa-callback`;

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;

  const auth = Buffer.from(`${config.mpesaConsumerKey}:${config.mpesaConsumerSecret}`).toString('base64');
  try {
    const { data } = await axios.get(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return accessToken;
  } catch (error) {
    console.error('M-Pesa token error:', error.response?.data || error.message);
    return null;
  }
};

const stkPush = async (phone, amount, orderNumber) => {
  if (!isConfigured()) {
    console.log('M-Pesa not configured — falling back to simulation');
    return { success: false, simulated: true };
  }

  const token = await getAccessToken();
  if (!token) return { success: false, error: 'Failed to get M-Pesa access token' };

  const shortCode = getShortCode();
  const passkey = getPassKey();
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

  const cleanedPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanedPhone.startsWith('0') ? '254' + cleanedPhone.slice(1) : cleanedPhone.startsWith('254') ? cleanedPhone : '254' + cleanedPhone;

  try {
    const { data } = await axios.post(
      `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${getCallbackUrl()}?order=${orderNumber}`,
        AccountReference: orderNumber.slice(0, 12),
        TransactionDesc: 'Nairobi Celtics FC',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        message: 'STK Push sent to your phone. Enter your M-Pesa PIN to complete payment.',
        simulated: false,
      };
    }

    return { success: false, error: data.ResponseDescription || 'M-Pesa request failed', simulated: false };
  } catch (error) {
    console.error('M-Pesa STK push error:', error.response?.data || error.message);
    return { success: false, error: 'M-Pesa service unavailable. Please try again.', simulated: false };
  }
};

const queryStatus = async (checkoutRequestId) => {
  const token = await getAccessToken();
  if (!token) return null;

  const shortCode = getShortCode();
  const passkey = getPassKey();
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

  try {
    const { data } = await axios.post(
      `${getBaseUrl()}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch {
    return null;
  }
};

module.exports = { stkPush, queryStatus, isConfigured };
