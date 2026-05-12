const simulateCardPayment = async (amount, cardDetails) => {
  await new Promise((r) => setTimeout(r, 1500));
  const success = Math.random() > 0.1;
  if (success) {
    return { success: true, ref: `CARD-${Date.now().toString(36).toUpperCase()}`, message: 'Payment successful' };
  }
  return { success: false, ref: null, message: 'Card declined. Please try another payment method.' };
};

const simulateMpesaPayment = async (amount, phone) => {
  await new Promise((r) => setTimeout(r, 2000));
  const success = Math.random() > 0.05;
  if (success) {
    return { success: true, ref: `MPESA-${Date.now().toString(36).toUpperCase()}`, message: 'M-Pesa STK Push accepted. Payment successful.' };
  }
  return { success: false, ref: null, message: 'M-Pesa transaction failed. Please try again.' };
};

module.exports = { simulateCardPayment, simulateMpesaPayment };
