const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true
  },
  customer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    phone: String
  },
  barber: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  service: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    name: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ratings: {
    quality: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    staffBehavior: { type: Number, min: 1, max: 5 }
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  tags: [{
    type: String,
    enum: ['friendly', 'professional', 'quick', 'clean', 'expensive', 'good_value', 'recommended']
  }],
  likes: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  response: {
    message: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: Date
  },
  images: [{
    url: String,
    publicId: String
  }],
  verified: { type: Boolean, default: false },
  metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

FeedbackSchema.index({ rating: 1 });
FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ 'customer.id': 1 });
FeedbackSchema.index({ 'barber.id': 1 });

FeedbackSchema.statics.getAverageRating = async function(barberId) {
  const result = await this.aggregate([
    { $match: { 'barber.id': barberId, isPublished: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
  ]);
  return result[0] || { avgRating: 0, total: 0 };
};

module.exports = mongoose.model('Feedback', FeedbackSchema);