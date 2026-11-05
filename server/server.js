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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://salon-app-tan-five.vercel.app',
  'https://salon-n2g8dak75-mdayansidd144s-projects.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
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
app.use('/api/bookings', appointmentRoutes);
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ success: false, message: err.message });
});
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Salon API Server running on port ${PORT}`);
  });
});