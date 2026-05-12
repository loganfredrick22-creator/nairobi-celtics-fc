const nodemailer = require('nodemailer');
const config = require('../config/env');

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: false,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (!config.emailUser || !config.emailPass) {
    console.log(`[DEV EMAIL] To: ${to}, Subject: ${subject}`);
    return { success: true, message: 'Dev mode - email logged' };
  }
  try {
    await transporter.sendMail({
      from: `"Nairobi Celtics FC" <${config.emailUser}>`,
      to,
      subject,
      html,
      attachments,
    });
    return { success: true, message: 'Email sent' };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

const sendOrderConfirmation = async (order) => {
  const html = `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #00C853; padding: 20px; text-align: center;">
        <h1 style="color: #0A0A0A; font-family: 'Bebas Neue', sans-serif; font-size: 32px;">NAIROBI CELTICS FC</h1>
      </div>
      <div style="padding: 30px; background: #0A0A0A; color: #FFFFFF;">
        <h2 style="font-family: 'Bebas Neue', sans-serif; color: #00C853;">Order Confirmed!</h2>
        <p>Thank you for your order, ${order.deliveryAddress?.fullName || 'Valued Fan'}.</p>
        <p style="background: #111111; padding: 15px; border-left: 3px solid #00C853;">
          <strong>Order Number:</strong> ${order.orderNumber}<br/>
          <strong>Total:</strong> KES ${order.total.toLocaleString()}<br/>
          <strong>Status:</strong> ${order.orderStatus}
        </p>
        <p>You will receive shipping updates as your order progresses.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          Nairobi Celtics FC | Kasarani, Nairobi, Kenya
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to: order.deliveryAddress?.email || order.guestEmail, subject: `Order Confirmed - ${order.orderNumber}`, html });
};

const sendTicketConfirmation = async (ticket, fixture) => {
  const html = `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #00C853; padding: 20px; text-align: center;">
        <h1 style="color: #0A0A0A; font-family: 'Bebas Neue', sans-serif; font-size: 32px;">NAIROBI CELTICS FC</h1>
      </div>
      <div style="padding: 30px; background: #0A0A0A; color: #FFFFFF;">
        <h2 style="font-family: 'Bebas Neue', sans-serif; color: #00C853;">Your Tickets Are Confirmed!</h2>
        <p>Booking Reference: <strong>${ticket.bookingRef}</strong></p>
        <div style="background: #111111; padding: 15px; border-left: 3px solid #00C853;">
          <p><strong>${fixture.opponent}</strong></p>
          <p>${new Date(fixture.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} | ${fixture.kickoff}</p>
          <p>Zone: ${ticket.seatZoneLabel} | Qty: ${ticket.quantity}</p>
          <p>Total: KES ${ticket.total.toLocaleString()}</p>
        </div>
        <p>Your e-ticket PDF is attached to this email.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          Nairobi Celtics FC | Kasarani, Nairobi, Kenya
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to: ticket.guestEmail || 'fan@example.com', subject: `Tickets Confirmed - ${ticket.bookingRef}`, html });
};

module.exports = { sendEmail, sendOrderConfirmation, sendTicketConfirmation };
