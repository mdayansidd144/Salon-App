const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`\${req.method} \${req.url}`);
  next();
});

// ============ IN-MEMORY DATABASE (No MongoDB Needed) ============
let services = [
  { id: '1', name: 'Classic Haircut', price: 299, duration: 30, description: 'Professional haircut with styling', isActive: true },
  { id: '2', name: 'Beard Trim', price: 149, duration: 20, description: 'Expert beard shaping and trim', isActive: true },
  { id: '3', name: 'Haircut + Beard', price: 399, duration: 50, description: 'Complete grooming package', isActive: true },
  { id: '4', name: 'Hot Towel Shave', price: 199, duration: 25, description: 'Luxury hot towel shave', isActive: true },
  { id: '5', name: 'Kids Haircut', price: 199, duration: 25, description: 'Special haircut for kids', isActive: true }
];

let appointments = [];
let nextAppointmentId = 1;

// Generate available time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 19; hour++) {
    slots.push(`\${hour.toString().padStart(2, '0')}:00`);
    if (hour !== 19) slots.push(`\${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

// ============ API ENDPOINTS ============

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running (in-memory mode)',
    timestamp: new Date().toISOString(),
    mongodb: 'not connected - using in-memory storage'
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
app.get('/api/services', (req, res) => {
  const activeServices = services.filter(s => s.isActive);
  res.json({ 
    success: true, 
    count: activeServices.length, 
    data: activeServices 
  });
});

// Get single service
app.get('/api/services/:id', (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, data: service });
});

// Create service
app.post('/api/services', (req, res) => {
  const newService = {
    id: String(services.length + 1),
    ...req.body,
    isActive: true
  };
  services.push(newService);
  res.json({ success: true, data: newService });
});

// Update service
app.put('/api/services/:id', (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  services[index] = { ...services[index], ...req.body };
  res.json({ success: true, data: services[index] });
});

// Delete service
app.delete('/api/services/:id', (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  services.splice(index, 1);
  res.json({ success: true, message: 'Service deleted' });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
  const { date, status } = req.query;
  let filtered = [...appointments];
  
  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }
  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }
  
  res.json({ success: true, count: filtered.length, data: filtered });
});

// Create appointment
app.post('/api/appointments', (req, res) => {
  const { customerName, customerEmail, customerPhone, serviceId, date, timeSlot, notes } = req.body;
  
  // Check if slot is available
  const existing = appointments.find(a => 
    a.date === date && 
    a.timeSlot === timeSlot && 
    a.status !== 'cancelled'
  );
  
  if (existing) {
    return res.status(400).json({ 
      success: false, 
      message: 'This time slot is already booked' 
    });
  }
  
  // Get service details
  const service = services.find(s => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  
  const newAppointment = {
    id: String(nextAppointmentId++),
    customerName,
    customerEmail,
    customerPhone,
    serviceId,
    serviceName: service.name,
    servicePrice: service.price,
    date,
    timeSlot,
    status: 'pending',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  res.json({ 
    success: true, 
    data: newAppointment,
    message: 'Appointment booked successfully!'
  });
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }
  appointments[index] = { ...appointments[index], ...req.body };
  res.json({ success: true, data: appointments[index] });
});

// Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }
  appointments[index].status = 'cancelled';
  res.json({ success: true, message: 'Appointment cancelled successfully' });
});

// Get available time slots
app.get('/api/appointments/available-slots/:date', (req, res) => {
  const { date } = req.params;
  const allSlots = generateTimeSlots();
  
  // Get booked slots for this date
  const bookedSlots = appointments
    .filter(a => a.date === date && a.status !== 'cancelled')
    .map(a => a.timeSlot);
  
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
  
  res.json({ 
    success: true, 
    data: availableSlots,
    date: date,
    bookedSlots: bookedSlots
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(a => a.date === today).length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  
  res.json({
    success: true,
    data: {
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      totalServices: services.length,
      totalRevenue: services.reduce((sum, s) => sum + s.price, 0)
    }
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\\n=================================');
  console.log('🚀 Salon Appointment API Server');
  console.log('=================================');
  console.log(`📡 Server: http://localhost:\${PORT}`);
  console.log(`💚 Health: http://localhost:\${PORT}/health`);
  console.log(`✂️  Services: http://localhost:\${PORT}/api/services`);
  console.log(`📅 Appointments: http://localhost:\${PORT}/api/appointments`);
  console.log(`⏰ Available Slots: http://localhost:\${PORT}/api/appointments/available-slots/2026-03-26`);
  console.log('=================================');
  console.log('📦 Running with IN-MEMORY storage (no MongoDB needed)');
  console.log('=================================\\n');
});
