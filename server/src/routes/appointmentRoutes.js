const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendSMS } = require('../services/smsService');
router.get('/available-slots/:date', (req, res) => {
const slots = [];
for (let hour = 10; hour <= 21; hour++) {
slots.push(`${hour.toString().padStart(2, '0')}:00`);
slots.push(`${hour.toString().padStart(2, '0')}:30`);
}
res.json({ success: true, data: slots });
});
router.post('/', async (req, res) => {
try {
const { customer, serviceId, barberId, date, startTime, endTime, amount } = req.body;
console.log("Creating appointment for:", customer.name);
const appointment = await Appointment.create({
customer,
serviceId,
barberId,
date,
startTime,
endTime,
amount,
status: 'confirmed',
payment: { status: 'paid', amount: amount }
});
const groomerMessage = `NEW BOOKING!\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nService: ${serviceId}\nDate: ${date}\nTime: ${startTime}\nAmount: ₹${amount}`;
console.log("Sending Email to barbers...");
await sendSMS(process.env.BARBER1_EMAIL, groomerMessage);
await sendSMS(process.env.BARBER2_EMAIL, groomerMessage);
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