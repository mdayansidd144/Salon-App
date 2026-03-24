const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ============ MODELS ============
// Define models (if they don't exist yet)
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const AppointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String },
  servicePrice: { type: Number },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  notes: { type: String, default: '' }
}, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

// ============ SEED INITIAL DATA ============
const seedServices = async () => {
  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany([
      { name: 'Classic Haircut', price: 299, duration: 30, description: 'Professional haircut with styling' },
      { name: 'Beard Trim', price: 149, duration: 20, description: 'Expert beard shaping and trim' },
      { name: 'Haircut + Beard', price: 399, duration: 50, description: 'Complete grooming package' },
      { name: 'Hot Towel Shave', price: 199, duration: 25, description: 'Luxury hot towel shave' },
      { name: 'Kids Haircut', price: 199, duration: 25, description: 'Special haircut for kids' },
      { name: 'Hair Color', price: 999, duration: 90, description: 'Professional hair coloring' }
    ]);
    console.log('✅ Services seeded!');
  }
};
seedServices();

// ============ API ENDPOINTS ============

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('name');
    res.json({ 
      success: true, 
      count: services.length, 
      data: services 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single service
app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create service (admin only)
app.post('/api/services', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update service
app.put('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const { date, status } = req.query;
    let query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (status) query.status = status;
    
    const appointments = await Appointment.find(query).sort({ date: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, serviceId, date, timeSlot, notes } = req.body;
    
    // Check if slot is available
    const existing = await Appointment.findOne({ 
      date: new Date(date), 
      timeSlot, 
      status: { $ne: 'cancelled' } 
    });
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked' 
      });
    }
    
    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    const appointment = await Appointment.create({
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      serviceName: service.name,
      servicePrice: service.price,
      date: new Date(date),
      timeSlot,
      notes
    });
    
    res.json({ 
      success: true, 
      data: appointment,
      message: 'Appointment booked successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get available time slots
app.get('/api/appointments/available-slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const selectedDate = new Date(date);
    
    // Generate all time slots (9 AM to 7 PM, 30 min intervals)
    const allSlots = [];
    for (let hour = 9; hour <= 19; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour !== 19) {
        allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Get booked slots for this date
    const bookedAppointments = await Appointment.find({
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59))
      },
      status: { $nin: ['cancelled'] }
    });
    
    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({ 
      success: true, 
      data: availableSlots,
      date: date,
      bookedSlots: bookedSlots
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    
    const services = await Service.find();
    const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);
    
    res.json({
      success: true,
      data: {
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalServices: services.length,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('🚀 Salon Appointment API Server');
  console.log('=================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`✂️  Services: http://localhost:${PORT}/api/services`);
  console.log(`📅 Appointments: http://localhost:${PORT}/api/appointments`);
  console.log(`⏰ Available Slots: http://localhost:${PORT}/api/appointments/available-slots/2026-03-25`);
  console.log('=================================\n');
});