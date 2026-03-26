const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger with timestamp
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ============ RAZORPAY INITIALIZATION ============
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxxxxxxxxx'
});

// ============ SERVICES DATA WITH CATEGORIES ============
const servicesData = {
  haircut: {
    title: "✂️ Haircut Styles",
    icon: "✂️",
    description: "Professional haircuts tailored to your style",
    services: [
      { id: 'hair_1', name: 'Classic Cut', price: 299, duration: 30, description: 'Timeless, clean cut for any occasion', image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500', popular: true, badge: 'Most Popular', category: 'haircut' },
      { id: 'hair_2', name: 'Fade Cut', price: 349, duration: 35, description: 'Smooth transition from short to long', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500', popular: true, badge: 'Trending', category: 'haircut' },
      { id: 'hair_3', name: 'Undercut', price: 399, duration: 40, description: 'Bold style with shaved sides', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500', popular: false, badge: null, category: 'haircut' },
      { id: 'hair_4', name: 'Pompadour', price: 449, duration: 45, description: 'Classic voluminous style', image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500', popular: true, badge: 'Premium', category: 'haircut' },
      { id: 'hair_5', name: 'French Crop', price: 379, duration: 35, description: 'Short textured style', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500', popular: false, badge: null, category: 'haircut' },
      { id: 'hair_6', name: 'Buzz Cut', price: 249, duration: 20, description: 'Low maintenance, sharp look', image: 'https://images.unsplash.com/photo-1503951914875-3fe63c2d3e2f?w=500', popular: false, badge: null, category: 'haircut' }
    ]
  },
  beard: {
    title: "🧔 Beard Grooming",
    icon: "🧔",
    description: "Expert beard shaping and styling",
    services: [
      { id: 'beard_1', name: 'Standard Trim', price: 149, duration: 20, description: 'Neat and clean beard shaping', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500', popular: true, badge: 'Popular', category: 'beard' },
      { id: 'beard_2', name: 'Full Beard Styling', price: 199, duration: 30, description: 'Complete beard makeover', image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500', popular: true, badge: 'Best Seller', category: 'beard' },
      { id: 'beard_3', name: 'Goatee Style', price: 179, duration: 25, description: 'Stylish goatee shaping', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500', popular: false, badge: null, category: 'beard' },
      { id: 'beard_4', name: 'Moustache Styling', price: 129, duration: 15, description: 'Perfect moustache shaping', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500', popular: false, badge: null, category: 'beard' },
      { id: 'beard_5', name: 'Premium Shave', price: 249, duration: 35, description: 'Luxury hot towel shave', image: 'https://images.unsplash.com/photo-1503951914875-3fe63c2d3e2f?w=500', popular: true, badge: 'Luxury', category: 'beard' }
    ]
  },
  spa: {
    title: "💆 Hair Spa",
    icon: "💆",
    description: "Rejuvenating hair treatments",
    services: [
      { id: 'spa_1', name: 'Basic Hair Spa', price: 599, duration: 60, description: 'Essential hair nourishment', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', popular: true, badge: 'Most Popular', category: 'spa' },
      { id: 'spa_2', name: 'Deep Conditioning', price: 749, duration: 75, description: 'Intensive moisture treatment', image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500', popular: false, badge: null, category: 'spa' },
      { id: 'spa_3', name: 'Hair Mask Treatment', price: 799, duration: 80, description: 'Repair damaged hair', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500', popular: true, badge: 'Recommended', category: 'spa' },
      { id: 'spa_4', name: 'Scalp Therapy', price: 849, duration: 85, description: 'Healthy scalp treatment', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', popular: false, badge: null, category: 'spa' },
      { id: 'spa_5', name: 'Premium Keratin', price: 1099, duration: 90, description: 'Smooth, frizz-free hair', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500', popular: true, badge: 'Premium', category: 'spa' }
    ]
  },
  facial: {
    title: "✨ Facial Treatments",
    icon: "✨",
    description: "Glowing skin treatments",
    services: [
      { id: 'facial_1', name: 'Basic Cleanup', price: 399, duration: 45, description: 'Deep cleansing and glow', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500', popular: true, badge: 'Essential', category: 'facial' },
      { id: 'facial_2', name: 'Gold Facial', price: 599, duration: 60, description: 'Luxury gold therapy', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500', popular: true, badge: 'Premium', category: 'facial' },
      { id: 'facial_3', name: 'Fruit Facial', price: 649, duration: 60, description: 'Natural fruit extracts', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', popular: false, badge: null, category: 'facial' },
      { id: 'facial_4', name: 'Charcoal Facial', price: 699, duration: 65, description: 'Deep pore cleansing', image: 'https://images.unsplash.com/photo-1519415943484-9fa187b6d1cd?w=500', popular: true, badge: 'Best for Acne', category: 'facial' },
      { id: 'facial_5', name: 'Premium O3 Facial', price: 899, duration: 70, description: 'Oxygen infusion therapy', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500', popular: false, badge: null, category: 'facial' }
    ]
  },
  grooming: {
    title: "🎯 Full Grooming",
    icon: "🎯",
    description: "Complete makeover packages",
    services: [
      { id: 'groom_1', name: 'Standard Grooming', price: 999, duration: 90, description: 'Haircut + Beard + Facial', image: 'https://images.unsplash.com/photo-1503951914875-3fe63c2d3e2f?w=500', popular: true, badge: 'Best Value', category: 'grooming' },
      { id: 'groom_2', name: 'Premium Grooming', price: 1199, duration: 110, description: 'Haircut + Beard + Spa', image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500', popular: true, badge: 'Popular', category: 'grooming' },
      { id: 'groom_3', name: 'Luxury Grooming', price: 1399, duration: 120, description: 'Full grooming + Spa', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500', popular: false, badge: null, category: 'grooming' },
      { id: 'groom_4', name: 'Royal Package', price: 1799, duration: 150, description: 'Everything + Premium treatments', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500', popular: true, badge: 'Royal', category: 'grooming' }
    ]
  },
  bridal: {
    title: "👰 Bride Grooming",
    icon: "👰",
    description: "Special bridal packages",
    services: [
      { id: 'bridal_1', name: 'Basic Bridal', price: 1999, duration: 120, description: 'Essential bridal grooming', image: 'https://images.unsplash.com/photo-1519415943484-9fa187b6d1cd?w=500', popular: true, badge: 'Essential', category: 'bridal' },
      { id: 'bridal_2', name: 'Premium Bridal', price: 2499, duration: 150, description: 'Complete bridal makeover', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500', popular: true, badge: 'Most Popular', category: 'bridal' },
      { id: 'bridal_3', name: 'Royal Bridal', price: 2999, duration: 180, description: 'Luxury bridal package', image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500', popular: true, badge: 'Luxury', category: 'bridal' },
      { id: 'bridal_4', name: 'Celebrity Package', price: 3999, duration: 210, description: 'Red carpet ready', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500', popular: false, badge: null, category: 'bridal' },
      { id: 'bridal_5', name: 'Full Makeover', price: 4999, duration: 240, description: 'Complete transformation', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500', popular: true, badge: 'Ultimate', category: 'bridal' }
    ]
  }
};

// Flatten all services for API response
const allServices = [];
Object.values(servicesData).forEach(category => {
  allServices.push(...category.services);
});

// ============ AUTHENTICATION ============
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';

const adminUser = {
  id: 'admin1',
  name: 'Admin',
  email: 'admin@salon.com',
  password: bcrypt.hashSync('admin123', 10),
  role: 'admin'
};

const barbers = [
  { id: 'barber1', name: 'Raj Kumar', email: 'raj@salon.com', password: bcrypt.hashSync('barber123', 10), role: 'barber', isActive: true },
  { id: 'barber2', name: 'Amit Sharma', email: 'amit@salon.com', password: bcrypt.hashSync('barber123', 10), role: 'barber', isActive: true }
];

let users = [adminUser, ...barbers];

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ============ APPOINTMENTS STORAGE ============
let appointments = [];
let nextId = 1;

function calculateEndTime(startTime, durationMinutes) {
  try {
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + durationMinutes;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  } catch (error) {
    return '00:00';
  }
}

// Add sample appointments
try {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const bookedSlots = [
    { time: '10:00', serviceId: 'hair_1', name: 'Classic Cut' },
    { time: '11:00', serviceId: 'beard_1', name: 'Standard Trim' },
    { time: '14:30', serviceId: 'hair_2', name: 'Fade Cut' }
  ];
  
  bookedSlots.forEach((slot) => {
    const service = allServices.find(s => s.id === slot.serviceId);
    if (service) {
      appointments.push({
        id: String(nextId++),
        customer: { name: 'Sample Customer', email: 'sample@email.com', phone: '9999999999', notes: '' },
        service: {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          image: service.image,
          category: service.category
        },
        date: tomorrowStr,
        startTime: slot.time,
        endTime: calculateEndTime(slot.time, service.duration),
        duration: service.duration,
        status: 'confirmed',
        payment: { status: 'paid', amount: service.price },
        createdAt: new Date().toISOString()
      });
    }
  });
  console.log(`📅 Loaded ${appointments.length} sample appointments`);
} catch (error) {
  console.error('Error loading sample appointments:', error);
}

function timeToMinutes(time) {
  if (!time) return 0;
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function generateAllTimeSlots() {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  slots.push('19:00');
  return slots;
}

function getAvailableSlots(date, serviceDuration) {
  try {
    const allSlots = generateAllTimeSlots();
    const dateStr = date ? date.split('T')[0] : '';
    
    const bookedForDate = appointments.filter(apt => {
      const aptDate = apt.date ? apt.date.split('T')[0] : '';
      return aptDate === dateStr && apt.status !== 'cancelled' && apt.status !== 'replaced';
    });
    
    const availableSlots = [];
    
    for (const slot of allSlots) {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + serviceDuration;
      
      if (slotEnd > 19 * 60) continue;
      if (slotStart >= 13 * 60 && slotStart < 14 * 60) continue;
      if (slotEnd > 13 * 60 && slotStart < 14 * 60) continue;
      
      let isAvailable = true;
      for (const booked of bookedForDate) {
        const bookedStart = timeToMinutes(booked.startTime);
        const bookedEnd = bookedStart + booked.duration;
        
        if (!(slotEnd <= bookedStart || slotStart >= bookedEnd)) {
          isAvailable = false;
          break;
        }
      }
      
      if (isAvailable) {
        availableSlots.push(slot);
      }
    }
    
    return availableSlots;
  } catch (error) {
    return [];
  }
}

// ============ API ENDPOINTS ============

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    services: allServices.length,
    appointments: appointments.length
  });
});

// ============ AUTH ENDPOINTS ============

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for:', email);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const token = generateToken(user);
    console.log('✅ Login successful for:', email);
    
    res.json({
      success: true,
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed: ' + error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const newUser = {
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
      phone: phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    const token = generateToken(newUser);
    
    res.json({
      success: true,
      token: token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ============ SERVICE ENDPOINTS ============

// Get all services (flattened)
app.get('/api/services', (req, res) => {
  res.json({ success: true, data: allServices });
});

// Get services by category
app.get('/api/services/category/:category', (req, res) => {
  const { category } = req.params;
  const categoryData = servicesData[category];
  if (categoryData) {
    res.json({ success: true, data: categoryData });
  } else {
    res.status(404).json({ success: false, message: 'Category not found' });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  const categories = Object.keys(servicesData).map(key => ({
    id: key,
    title: servicesData[key].title,
    icon: servicesData[key].icon,
    description: servicesData[key].description,
    serviceCount: servicesData[key].services.length
  }));
  res.json({ success: true, data: categories });
});

app.get('/api/appointments/available-slots/:date', (req, res) => {
  try {
    const { date } = req.params;
    const { serviceId } = req.query;
    let duration = 30;
    if (serviceId) {
      const service = allServices.find(s => s.id === serviceId);
      if (service) duration = service.duration;
    }
    const availableSlots = getAvailableSlots(date, duration);
    res.json({ success: true, data: availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create appointment
app.post('/api/appointments', (req, res) => {
  try {
    const { customer, serviceId, date, startTime, notes, customizations } = req.body;
    
    const service = allServices.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    const availableSlots = getAvailableSlots(date, service.duration);
    if (!availableSlots.includes(startTime)) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
    }
    
    const endTime = calculateEndTime(startTime, service.duration);
    
    const newAppointment = {
      id: String(nextId++),
      customer: { name: customer.name, email: customer.email, phone: customer.phone, notes: notes || '' },
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        image: service.image,
        category: service.category
      },
      date: date,
      startTime: startTime,
      endTime: endTime,
      duration: service.duration,
      status: 'pending',
      payment: { status: 'pending', amount: service.price },
      createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    console.log(`✅ New appointment created: ${newAppointment.id} - ${customer.name} at ${startTime}`);
    
    res.json({ success: true, data: newAppointment });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
  res.json({ success: true, data: appointments });
});

// Cancel appointment
app.delete('/api/appointments/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const { reason, cancelledBy = 'customer' } = req.body;
    
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
    }
    
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    if (appointmentDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot cancel past appointments' });
    }
    
    appointment.status = 'cancelled';
    appointment.cancelledBy = cancelledBy;
    appointment.cancellationReason = reason || 'Cancelled by customer';
    appointment.cancelledAt = new Date().toISOString();
    appointment.originalSlot = {
      date: appointment.date,
      startTime: appointment.startTime,
      duration: appointment.duration
    };
    
    console.log(`❌ Appointment ${id} CANCELLED by ${cancelledBy}. Slot is now AVAILABLE for walk-in`);
    
    res.json({ 
      success: true, 
      message: 'Appointment cancelled successfully. Slot is now available for walk-in customers.',
      data: appointment
    });
    
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get cancelled appointments
app.get('/api/appointments/cancelled', (req, res) => {
  try {
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');
    res.json({ 
      success: true, 
      data: cancelledAppointments.map(apt => ({
        id: apt.id,
        customerName: apt.customer.name,
        serviceName: apt.service.name,
        originalDate: apt.originalSlot?.date || apt.date,
        originalTime: apt.originalSlot?.startTime || apt.startTime,
        cancellationReason: apt.cancellationReason,
        cancelledAt: apt.cancelledAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get available walk-in slots
app.get('/api/appointments/available-walkin-slots', (req, res) => {
  try {
    const cancelledSlots = appointments.filter(apt => 
      apt.status === 'cancelled' && 
      apt.cancelledBy === 'customer' &&
      apt.status !== 'replaced'
    );
    
    const availableSlots = cancelledSlots.map(apt => ({
      date: apt.originalSlot?.date || apt.date,
      time: apt.originalSlot?.startTime || apt.startTime,
      originalCustomer: apt.customer.name,
      serviceName: apt.service.name,
      serviceImage: apt.service.image,
      cancellationReason: apt.cancellationReason,
      cancelledAt: apt.cancelledAt,
      appointmentId: apt.id
    }));
    
    res.json({ success: true, data: availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Walk-in booking
app.post('/api/appointments/offline', (req, res) => {
  try {
    const { customer, serviceId, date, startTime, notes, customizations } = req.body;
    
    const service = allServices.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    const cancelledSlot = appointments.find(apt => {
      const aptDate = apt.date?.split('T')[0];
      const requestDate = date.split('T')[0];
      return aptDate === requestDate && 
             apt.startTime === startTime && 
             apt.status === 'cancelled' &&
             apt.cancelledBy === 'customer';
    });
    
    if (!cancelledSlot) {
      return res.status(409).json({ 
        success: false, 
        message: 'This slot is not available. Only slots cancelled by customers can be booked for walk-ins.' 
      });
    }
    
    const endTime = calculateEndTime(startTime, service.duration);
    
    const newAppointment = {
      id: String(nextId++),
      customer: {
        name: customer.name,
        email: customer.email || 'walkin@salon.com',
        phone: customer.phone,
        notes: notes || `Walk-in customer taking cancelled slot from ${cancelledSlot.customer.name}`,
        isWalkIn: true
      },
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        image: service.image,
        category: service.category
      },
      date: date,
      startTime: startTime,
      endTime: endTime,
      duration: service.duration,
      status: 'confirmed',
      payment: {
        status: 'paid',
        amount: service.price,
        paymentMethod: 'cash'
      },
      isWalkIn: true,
      isOverride: true,
      overrideReason: `Slot was previously cancelled by: ${cancelledSlot.customer.name}`,
      originalCancelledAppointmentId: cancelledSlot.id,
      createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    
    cancelledSlot.status = 'replaced';
    cancelledSlot.replacedBy = newAppointment.id;
    cancelledSlot.replacedAt = new Date().toISOString();
    
    console.log(`🔄 Walk-in booked for cancelled slot ${startTime}`);
    
    res.json({ 
      success: true, 
      data: newAppointment,
      message: 'Walk-in added successfully! Slot was previously cancelled by a customer.',
      wasOverride: true
    });
    
  } catch (error) {
    console.error('Offline booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Today's appointments with priority
app.get('/api/appointments/today/priority', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => {
      const aptDate = a.date?.split('T')[0];
      return aptDate === today && a.status !== 'cancelled' && a.status !== 'replaced';
    });
    
    const sortedAppointments = todayAppointments.sort((a, b) => {
      if (a.isWalkIn && !b.isWalkIn) return -1;
      if (!a.isWalkIn && b.isWalkIn) return 1;
      return a.startTime.localeCompare(b.startTime);
    });
    
    res.json({ 
      success: true, 
      data: sortedAppointments,
      counts: {
        total: todayAppointments.length,
        walkIns: todayAppointments.filter(a => a.isWalkIn).length,
        online: todayAppointments.filter(a => !a.isWalkIn).length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = appointments.filter(a => a.date?.split('T')[0] === today && a.status !== 'cancelled');
  const totalRevenue = appointments.filter(a => a.payment?.status === 'paid').reduce((sum, a) => sum + (a.payment?.amount || 0), 0);
  const popularServices = [];
  
  const serviceCount = {};
  appointments.forEach(apt => {
    const serviceName = apt.service?.name;
    if (serviceName) {
      serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
    }
  });
  
  Object.entries(serviceCount).forEach(([name, count]) => {
    popularServices.push({ name, count });
  });
  popularServices.sort((a, b) => b.count - a.count);
  
  res.json({ 
    success: true, 
    data: { 
      totalBookings: appointments.filter(a => a.status !== 'cancelled').length, 
      todayBookings: todayBookings.length, 
      totalRevenue: totalRevenue,
      popularServices: popularServices.slice(0, 5)
    } 
  });
});

// ============ PAYMENT ENDPOINTS ============

app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
    
    console.log(`💰 Creating Razorpay order for ₹${amount} - Appointment: ${appointmentId}`);
    
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${appointmentId}`,
      payment_capture: 1,
      notes: {
        appointmentId: appointmentId
      }
    };
    
    const order = await razorpayInstance.orders.create(options);
    
    console.log(`✅ Order created: ${order.id}`);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create order'
    });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;
    
    console.log(`🔐 Verifying payment for appointment: ${appointmentId}`);
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    const isValid = expectedSignature === razorpay_signature;
    
    if (!isValid) {
      console.error('❌ Invalid payment signature');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      });
    }
    
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.payment.status = 'paid';
      appointment.payment.transactionId = razorpay_payment_id;
      appointment.payment.paidAt = new Date().toISOString();
      appointment.status = 'confirmed';
      console.log(`✅ Appointment ${appointmentId} confirmed after payment`);
    }
    
    res.json({ 
      success: true, 
      message: 'Payment verified successfully!' 
    });
    
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Payment verification failed'
    });
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
  console.log(`✂️  Services: ${allServices.length} total`);
  console.log(`📂 Categories: ${Object.keys(servicesData).length}`);
  console.log(`📅 Appointments: ${appointments.length} total`);
  console.log(`🔐 Admin Login: admin@salon.com / admin123`);
  console.log(`🔐 Barber Login: raj@salon.com / barber123`);
  console.log('=================================');
  console.log('🎨 Category-Based API Endpoints:');
  console.log(`   GET /api/categories - Get all categories`);
  console.log(`   GET /api/services/category/:category - Get services by category`);
  console.log(`   GET /api/services - Get all services`);
  console.log('=================================\n');
});