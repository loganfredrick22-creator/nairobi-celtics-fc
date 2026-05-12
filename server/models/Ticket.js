const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    bookingRef: { type: String, unique: true },
    fixture: { type: mongoose.Schema.Types.ObjectId, ref: 'Fixture', required: true },
    seatZone: {
      type: String,
      enum: ['green', 'blue', 'silver', 'gold', 'platinum'],
      required: true,
    },
    seatZoneLabel: { type: String },
    quantity: { type: Number, required: true, min: 1, max: 10 },
    ticketType: {
      type: String,
      enum: ['adult', 'under16', 'senior'],
      default: 'adult',
    },
    pricePerTicket: { type: Number, required: true },
    total: { type: Number, required: true },
    deliveryMethod: {
      type: String,
      enum: ['eticket', 'collection', 'courier'],
      default: 'eticket',
    },
    collectionPoint: { type: String },
    deliveryAddress: {
      fullName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      county: String,
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa', 'card', 'airtel', 'kcb'],
      default: 'mpesa',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentRef: { type: String },
    qrCode: { type: String },
    status: {
      type: String,
      enum: ['active', 'used', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

ticketSchema.index({ bookingRef: 1 });
ticketSchema.index({ user: 1 });
ticketSchema.index({ fixture: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
