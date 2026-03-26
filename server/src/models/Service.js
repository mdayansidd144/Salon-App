const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add service name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes']
  },
  price: {
    type: Number,
    required: [true, 'Please add price']
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);