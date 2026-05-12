const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['tour', 'hospitality', 'academy'],
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    tourDate: { type: Date },
    tourTime: { type: String },
    groupSize: { type: Number },
    hospitalityType: { type: String },
    academyProgram: { type: String },
    childName: { type: String },
    childAge: { type: Number },
    message: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
