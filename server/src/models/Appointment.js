const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  appointmentNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    profileImage: { type: String, default: '' },
    notes: { type: String, default: '' },
    preferences: {
      type: Map,
      of: String,
      default: {}
    }
  },
  barber: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    avatar: String
  },
  service: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    name: String,
    price: Number,
    duration: Number,
    category: String
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
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'pending',
    index: true
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['razorpay', 'phonepe', 'paytm', 'cash', 'card', 'upi'],
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
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    whatsappSent: { type: Boolean, default: false },
    sentAt: Date,
    reminderHistory: [{
      type: { type: String, enum: ['email', 'sms', 'whatsapp'] },
      sentAt: Date,
      status: { type: String, enum: ['sent', 'failed', 'delivered'] }
    }]
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date,
    tags: [String]
  },
  analytics: {
    pageLoadTime: Number,
    bookingTime: Number,
    deviceType: String,
    browser: String,
    location: {
      ip: String,
      city: String,
      country: String
    }
  },
  waitlist: {
    position: Number,
    notified: { type: Boolean, default: false }
  },
  checkInTime: Date,
  checkOutTime: Date,
  cancelledBy: { type: String, enum: ['customer', 'barber', 'system', 'admin'] },
  cancellationReason: String,
  cancelledAt: Date,
  rescheduleHistory: [{
    oldDate: Date,
    oldTime: String,
    newDate: Date,
    newTime: String,
    reason: String,
    rescheduledAt: Date
  }],
  metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
AppointmentSchema.index({ date: 1, barber: 1, startTime: 1 });
AppointmentSchema.index({ 'customer.email': 1 });
AppointmentSchema.index({ status: 1, date: 1 });
AppointmentSchema.index({ appointmentNumber: 1 });
AppointmentSchema.index({ 'payment.status': 1 });
AppointmentSchema.index({ createdAt: -1 });

// Virtual for revenue
AppointmentSchema.virtual('revenue').get(function() {
  return this.payment.status === 'paid' ? this.payment.amount : 0;
});

// Virtual for duration in hours
AppointmentSchema.virtual('durationHours').get(function() {
  return this.duration / 60;
});

// Pre-save hook
AppointmentSchema.pre('save', async function(next) {
  if (!this.appointmentNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Appointment').countDocuments();
    this.appointmentNumber = `SALON-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Static methods
AppointmentSchema.statics.getTodaysAppointments = function() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return this.find({ date: { $gte: start, $lte: end } });
};

AppointmentSchema.statics.getWeeklyRevenue = function() {
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return this.aggregate([
    { $match: { date: { $gte: start }, 'payment.status': 'paid' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, total: { $sum: '$payment.amount' } } },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('Appointment', AppointmentSchema);