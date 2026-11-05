const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendSMS } = require('../services/smsService');

router.get('/slots', (req, res) => {
  const slots = [];
  for (let hour = 10; hour <= 21; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  res.json({ success: true, slots });
});

router.post('/', async (req, res) => {
  try {
    const { customer, serviceId, barberId, date, startTime, endTime, amount } = req.body;
    
    console.log("Creating appointment for:", customer?.name);

    const appointment = await Appointment.create({
      customer: {
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone
      },
      serviceId,
      barberId,
      date,
      startTime,
      endTime,
      amount,
      status: 'confirmed',
      payment: { status: 'paid', amount: amount }
    });

    try {
      const groomerMessage = `NEW BOOKING!\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nService: ${serviceId}\nDate: ${date}\nTime: ${startTime}\nAmount: ₹${amount}`;
      if (process.env.BARBER1_EMAIL) await sendSMS(process.env.BARBER1_EMAIL, groomerMessage);
      if (process.env.BARBER2_EMAIL) await sendSMS(process.env.BARBER2_EMAIL, groomerMessage);
    } catch (smsErr) {
      console.log("SMS failed but booking succeeded.");
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Create appointment error:", error.message);
    // This returns the exact validation error to the frontend instead of crashing
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/groomer-dashboard', protect, async (req, res) => {
  // Keep your existing code for this route
});

router.put('/:id/complete', protect, async (req, res) => {
  // Keep your existing code for this route
});

router.get('/', protect, async (req, res) => {
  // Keep your existing code for this route
});

module.exports = router;