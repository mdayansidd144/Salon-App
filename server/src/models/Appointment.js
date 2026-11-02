const mongoose = require('mongoose');
const AppointmentSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    notes: { type: String, default: '' }
  },
  serviceId: { 
    type: String, 
    required: true 
  },
  barberId: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'confirmed' 
  },
  payment: {
    status: { type: String, default: 'paid' },
    amount: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);