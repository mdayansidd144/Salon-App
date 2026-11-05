const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { Resend } = require('resend');

// Safely initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

    // Send Email via Resend if API key exists
    if (resend) {
      try {
        console.log("Sending booking email via Resend...");
        const emailResponse = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: process.env.EMAIL_USER,
          subject: `New Booking: ${customer.name}`,
          text: `
            NEW BOOKING!
            Customer: ${customer.name}
            Phone: ${customer.phone}
            Service: ${serviceId}
            Date: ${date}
            Time: ${startTime}
            Amount: ₹${amount}
          `
        });
        console.log("Booking email sent:", emailResponse);
      } catch (emailErr) {
        console.error("Booking email failed:", emailErr.message);
      }
    } else {
      console.log("Skipped booking email: RESEND_API_KEY is missing.");
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Create appointment error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/groomer-dashboard', protect, async (req, res) => {
  try {
    const groomerId = req.user.id;
    const groomer = await User.findById(groomerId);
    if (!groomer) return res.status(404).json({ success: false, message: 'Groomer not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      date: { $gte: today, $lt: tomorrow },
      'barber.id': groomerId,
      status: { $ne: 'cancelled' }
    }).sort({ startTime: 1 });

    const todayEarnings = appointments
      .filter(a => a.payment?.status === 'paid')
      .reduce((sum, a) => sum + (a.payment.amount * 0.7), 0);

    res.json({
      success: true,
      data: {
        appointments,
        groomerName: groomer.name,
        todayEarnings: Math.round(todayEarnings),
        totalAppointments: appointments.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/complete', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    appointment.status = 'completed';
    await appointment.save();
    res.json({ success: true, message: 'Completed!', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;