const Ticket = require('../models/Ticket');
const Fixture = require('../models/Fixture');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { generateBookingRef } = require('../utils/generateBookingRef');
const { generateQRCodeBase64 } = require('../utils/generateQRCode');
const { simulateCardPayment, simulateMpesaPayment } = require('../services/paymentService');
const { sendTicketConfirmation } = require('../services/emailService');
const { generateTicketPDF } = require('../services/pdfService');

const ZONE_PRICES = {
  green: { label: 'Green Zone (General Standing)', price: 500 },
  blue: { label: 'Blue Zone (Lower Tier)', price: 1200 },
  silver: { label: 'Silver Zone (Middle Tier)', price: 2500 },
  gold: { label: 'Gold Zone (VIP Upper)', price: 5000 },
  platinum: { label: 'Platinum Suite', price: 15000 },
};

const getAvailableMatches = async (req, res) => {
  try {
    const fixtures = await Fixture.find({
      status: 'scheduled',
      date: { $gte: new Date() },
      isHomeGame: true,
      ticketAvailable: true,
    }).sort({ date: 1 }).limit(8);
    sendSuccess(res, { matches: fixtures }, 'Available matches retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getMatchSeatAvailability = async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id);
    if (!fixture) return sendError(res, 'Fixture not found', 404);

    const zones = Object.entries(ZONE_PRICES).map(([key, val]) => ({
      zone: key,
      label: val.label,
      price: val.price,
      available: Math.floor(Math.random() * 500) + 50,
      total: key === 'green' ? 15000 : key === 'platinum' ? 50 : 2000,
    }));

    sendSuccess(res, { fixture, zones }, 'Seat availability retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const purchaseTickets = async (req, res) => {
  try {
    const { fixtureId, seatZone, quantity, ticketType, deliveryMethod, collectionPoint, deliveryAddress, paymentMethod, guestEmail } = req.body;

    const fixture = await Fixture.findById(fixtureId);
    if (!fixture) return sendError(res, 'Fixture not found', 404);

    const zone = ZONE_PRICES[seatZone];
    if (!zone) return sendError(res, 'Invalid seat zone', 400);

    let pricePerTicket = zone.price;
    if (ticketType === 'under16') pricePerTicket = Math.round(pricePerTicket * 0.7);
    else if (ticketType === 'senior') pricePerTicket = Math.round(pricePerTicket * 0.8);

    const bookingRef = generateBookingRef('TKT');
    const qrData = { bookingRef, fixture: fixture.opponent, zone: seatZone, qty: quantity, date: fixture.date };
    const qrCode = await generateQRCodeBase64(qrData);

    const total = pricePerTicket * quantity;

    const ticket = await Ticket.create({
      user: req.user?._id,
      guestEmail: guestEmail || (req.user?.email),
      bookingRef,
      fixture: fixtureId,
      seatZone,
      seatZoneLabel: zone.label,
      quantity,
      ticketType,
      pricePerTicket,
      total,
      deliveryMethod,
      collectionPoint,
      deliveryAddress,
      paymentMethod,
      qrCode,
    });

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $push: { ticketHistory: ticket._id } });
    }

    sendSuccess(res, { ticket }, 'Tickets created', 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const payTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ bookingRef: req.params.bookingRef }).populate('fixture');
    if (!ticket) return sendError(res, 'Ticket not found', 404);
    if (ticket.paymentStatus === 'paid') return sendError(res, 'Already paid', 400);

    let paymentResult;
    if (ticket.paymentMethod === 'mpesa') {
      paymentResult = await simulateMpesaPayment(ticket.total, req.body.phone);
    } else {
      paymentResult = await simulateCardPayment(ticket.total, req.body);
    }

    if (paymentResult.success) {
      ticket.paymentStatus = 'paid';
      ticket.paymentRef = paymentResult.ref;
      await ticket.save();
      await sendTicketConfirmation(ticket, ticket.fixture);
      sendSuccess(res, { ticket }, 'Payment successful');
    } else {
      ticket.paymentStatus = 'failed';
      await ticket.save();
      sendError(res, paymentResult.message, 400);
    }
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getTicketByRef = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ bookingRef: req.params.bookingRef }).populate('fixture');
    if (!ticket) return sendError(res, 'Ticket not found', 404);
    sendSuccess(res, { ticket }, 'Ticket retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.params.userId }).populate('fixture').sort({ createdAt: -1 });
    sendSuccess(res, { tickets }, 'User tickets retrieved');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getAvailableMatches, getMatchSeatAvailability, purchaseTickets, payTicket, getTicketByRef, getUserTickets };
