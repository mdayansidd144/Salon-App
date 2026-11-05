require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { servicesData } = require('./src/data/services');
const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const { seedAdmin } = require('./src/controllers/authController');

const app = express();

// PERMANENT CORS FIX
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost, your production URL, or any Vercel preview URL
    if (
      origin === 'http://localhost:3000' ||
      origin === 'http://localhost:3001' ||
      origin === 'https://salon-app-tan-five.vercel.app' ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/api/services', (req, res) => {
  res.json({ success: true, data: servicesData });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/auth/google', require('./src/routes/googleAuth'));

// ROUTE FIX: Ensure the frontend hits the appointmentRoutes file
app.use('/api/bookings', appointmentRoutes);

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`\n🚀 Salon API Server`);
    console.log(`📡 http://localhost:${PORT}`);
  });
});