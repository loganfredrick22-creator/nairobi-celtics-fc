const mpesaFailures = [
  { msg: 'M-Pesa transaction timed out. Please try again.' },
  { msg: 'Insufficient M-Pesa balance.' },
  { msg: 'M-Pesa PIN entry cancelled by user.' },
  { msg: 'Transaction declined by M-Pesa. Please contact Safaricom.' },
];

const cardFailures = [
  { msg: 'Card declined. Insufficient funds.', code: 'insufficient_funds' },
  { msg: 'Card declined. Please contact your bank.', code: 'card_declined' },
  { msg: 'Transaction blocked by fraud prevention.', code: 'fraud_blocked' },
  { msg: 'Card expired. Please use a different card.', code: 'expired_card' },
  { msg: '3D Secure authentication failed.', code: '3ds_failed' },
];

const mpesaPrefixes = ['070', '071', '072', '074', '075', '076', '079', '010', '011'];

const isValidMpesaPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('254')) {
    return mpesaPrefixes.some((p) => digits.startsWith('254' + p.slice(1)));
  }
  if (digits.length === 10 && digits.startsWith('07')) {
    return mpesaPrefixes.some((p) => digits.startsWith('0' + p.slice(1)));
  }
  return false;
};

const detectCardType = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  return 'Unknown';
};

const luhnCheck = (num) => {
  const digits = num.replace(/\s/g, '');
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

const simulateCardPayment = async (amount, cardDetails) => {
  const { cardNumber, expiry, cvv, name } = cardDetails || {};

  if (!cardNumber || !expiry || !cvv || !name) {
    return { success: false, ref: null, message: 'Incomplete card details.', code: 'incomplete' };
  }

  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { success: false, ref: null, message: 'Invalid card number.', code: 'invalid_number' };
  }

  if (!luhnCheck(cleaned)) {
    return { success: false, ref: null, message: 'Invalid card number — failed checksum.', code: 'invalid_number' };
  }

  const [mm, yy] = expiry.split('/').map((s) => s.trim());
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  const expYear = parseInt(yy, 10);
  const expMonth = parseInt(mm, 10);

  if (!mm || !yy || expMonth < 1 || expMonth > 12) {
    return { success: false, ref: null, message: 'Invalid expiry date.', code: 'invalid_expiry' };
  }

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { success: false, ref: null, message: 'Card has expired.', code: 'expired_card' };
  }

  const cardType = detectCardType(cleaned);
  const expectedCvvLength = cardType === 'American Express' ? 4 : 3;
  if (cvv.length !== expectedCvvLength || !/^\d+$/.test(cvv)) {
    return { success: false, ref: null, message: `Invalid CVV — ${cardType} requires ${expectedCvvLength} digits.`, code: 'invalid_cvv' };
  }

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

  const success = Math.random() > 0.15;
  if (success) {
    return {
      success: true,
      ref: `CARD-${Date.now().toString(36).toUpperCase()}-${cleaned.slice(-4)}`,
      message: 'Payment successful.',
      cardType,
      last4: cleaned.slice(-4),
    };
  }

  const failure = cardFailures[Math.floor(Math.random() * cardFailures.length)];
  return { success: false, ref: null, message: failure.msg, code: failure.code };
};

const simulateMpesaPayment = async (amount, phone) => {
  if (!phone || !isValidMpesaPhone(phone)) {
    return {
      success: false,
      ref: null,
      message: 'Invalid M-Pesa phone number. Use a valid Safaricom line (070x, 071x, 072x, 074x, 075x, 076x, 079x, 010x, 011x).',
      code: 'invalid_phone',
    };
  }

  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2000));

  const success = Math.random() > 0.1;
  if (success) {
    const ref = `MPESA-${Date.now().toString(36).toUpperCase()}`;
    const formattedPhone = phone.replace(/\D/g, '').replace(/^0/, '+254');
    return {
      success: true,
      ref,
      message: `STK Push sent to ${formattedPhone}. Payment successful.`,
      phone: formattedPhone,
      mpesaRef: `${ref.slice(-10)}`,
    };
  }

  const failure = mpesaFailures[Math.floor(Math.random() * mpesaFailures.length)];
  return { success: false, ref: null, message: failure.msg, code: 'mpesa_failed' };
};

const simulateAirtelPayment = async (amount, phone) => {
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2000));
  const success = Math.random() > 0.1;
  if (success) {
    return {
      success: true,
      ref: `AIRTEL-${Date.now().toString(36).toUpperCase()}`,
      message: 'Airtel Money payment successful.',
    };
  }
  return { success: false, ref: null, message: 'Airtel Money transaction failed. Please try again.', code: 'airtel_failed' };
};

const simulatePaypalPayment = async (amount) => {
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));
  const success = Math.random() > 0.08;
  if (success) {
    return {
      success: true,
      ref: `PAYPAL-${Date.now().toString(36).toUpperCase()}`,
      message: 'PayPal payment successful.',
    };
  }
  return { success: false, ref: null, message: 'PayPal transaction declined.', code: 'paypal_failed' };
};

module.exports = { simulateCardPayment, simulateMpesaPayment, simulateAirtelPayment, simulatePaypalPayment };
