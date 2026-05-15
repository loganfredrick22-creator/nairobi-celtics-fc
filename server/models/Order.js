const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    size: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    promoDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    deliveryMethod: {
      type: String,
      enum: ['clickcollect', 'nairobi', 'nationwide', 'eastafrica', 'international'],
      required: true,
    },
    deliveryAddress: {
      fullName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      county: String,
      country: { type: String, default: 'Kenya' },
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa', 'card', 'airtel', 'paypal'],
      default: 'mpesa',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentRef: { type: String },
    paymentIntentId: { type: String },
    receiptUrl: { type: String },
    orderStatus: {
      type: String,
      enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });

module.exports = mongoose.model('Order', orderSchema);
