const Appointment = require('../models/Appointment');
const { allServices } = require('../data/services');
const { getAvailableSlots } = require('../services/slotService');
const { sendSMS, notifyAllBarbers } = require('../services/smsService');
function calculateEndTime(startTime, duration) {
  const [h, m] = startTime.split(':').map(Number);
  const total = h * 60 + m + duration;
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const { serviceId } = req.query;
    
    let duration = 30;
    if (serviceId) {
      const service = allServices.find(s => s.id === serviceId);
      if (service) duration = service.duration;
    }
    
    const slots = await getAvailableSlots(date, duration);
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE appointment
exports.createAppointment = async (req, res) => {
  try {
    const { customer, serviceId, date, startTime, notes } = req.body;

    const service = allServices.find(s => s.id === serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const availableSlots = await getAvailableSlots(date, service.duration);
    if (!availableSlots.includes(startTime)) {
      return res.status(409).json({ success: false, message: 'This slot is no longer available.' });
    }

    const endTime = calculateEndTime(startTime, service.duration);

    const appointment = await Appointment.create({
      customer: { ...customer, notes: notes || '' },
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        image: service.image,
        category: service.category
      },
      date: new Date(date),
      startTime,
      endTime,
      status: 'pending',
      payment: { status: 'pending', amount: service.price }
    });

    // Send SMS notifications
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const customerMessage = `Salon Pro: Your appointment for ${service.name} on ${formattedDate} at ${startTime} is pending. Complete payment to confirm.`;
    await sendSMS(customer.phone, customerMessage);

    const barberMessage = `NEW BOOKING!\nCustomer: ${customer.name}\nService: ${service.name}\nDate: ${formattedDate}\nTime: ${startTime}\nPhone: ${customer.phone}\nAmount: ₹${service.price}`;
    await notifyAllBarbers(barberMessage);

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all appointments (admin)
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CANCEL appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE status
exports.updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};