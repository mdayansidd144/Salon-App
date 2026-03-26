const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  metrics: {
    totalBookings: { type: Number, default: 0 },
    confirmedBookings: { type: Number, default: 0 },
    cancelledBookings: { type: Number, default: 0 },
    noShows: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageBookingValue: { type: Number, default: 0 },
    customerCount: { type: Number, default: 0 },
    newCustomers: { type: Number, default: 0 },
    returningCustomers: { type: Number, default: 0 }
  },
  services: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    name: String,
    bookings: Number,
    revenue: Number
  }],
  barbers: [{
    barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    bookings: Number,
    revenue: Number,
    averageRating: Number
  }],
  hourly: {
    type: Map,
    of: Number
  },
  peakHours: [{
    hour: Number,
    bookings: Number
  }],
  popularDays: [{
    day: String,
    bookings: Number
  }],
  conversionRate: {
    visitors: Number,
    bookings: Number,
    rate: Number
  },
  paymentMethods: {
    razorpay: Number,
    phonepe: Number,
    paytm: Number,
    cash: Number,
    card: Number,
    upi: Number
  },
  customerRetention: {
    new: Number,
    returning: Number,
    retentionRate: Number
  },
  revenueByService: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    name: String,
    revenue: Number,
    percentage: Number
  }]
}, {
  timestamps: true
});

AnalyticsSchema.index({ date: -1 });

AnalyticsSchema.statics.generateDailyReport = async function(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  const appointments = await mongoose.model('Appointment').find({
    date: { $gte: start, $lte: end }
  }).populate('service.id barber.id');
  
  const totalBookings = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;
  const revenue = appointments.filter(a => a.payment.status === 'paid').reduce((sum, a) => sum + a.payment.amount, 0);
  
  return this.findOneAndUpdate(
    { date: start },
    {
      $set: {
        'metrics.totalBookings': totalBookings,
        'metrics.confirmedBookings': confirmed,
        'metrics.cancelledBookings': cancelled,
        'metrics.totalRevenue': revenue,
        'metrics.averageBookingValue': totalBookings ? revenue / totalBookings : 0
      }
    },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Analytics', AnalyticsSchema);