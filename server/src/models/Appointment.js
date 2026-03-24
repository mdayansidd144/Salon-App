const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  appointmentNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    notes: { type: String, default: '' }
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending',
    index: true
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['razorpay', 'phonepe', 'paytm', 'cash', 'upi'],
      default: 'cash'
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    transactionId: String,
    orderId: String,
    paymentId: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date,
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  reminders: {
    smsSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    lastSentAt: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes for performance
AppointmentSchema.index({ date: 1, barber: 1, startTime: 1 });
AppointmentSchema.index({ 'customer.email': 1 });
AppointmentSchema.index({ appointmentNumber: 1 });

// Generate appointment number before save
AppointmentSchema.pre('save', async function(next) {
  if (!this.appointmentNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Appointment').countDocuments();
    this.appointmentNumber = `SALON-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);