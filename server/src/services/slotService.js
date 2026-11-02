const Appointment = require('../models/Appointment');
const BUSINESS_HOURS = { start: 9, end: 19, slotDuration: 30, breakStart: 13, breakEnd: 14 };
function timeToMinutes(time) {
  if (!time) return 0;
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}
function generateAllTimeSlots() {
  const slots = [];
  for (let hour = BUSINESS_HOURS.start; hour <= BUSINESS_HOURS.end - 1; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}
async function getAvailableSlots(date, serviceDuration) {
  try {
    const allSlots = generateAllTimeSlots();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const bookedAppointments = await Appointment.find({
      date: { $gte: start, $lt: end },
      status: { $nin: ['cancelled'] }
    });
    const availableSlots = [];
    for (const slot of allSlots) {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + serviceDuration;
      if (slotEnd > BUSINESS_HOURS.end * 60) continue;
      if (slotStart >= BUSINESS_HOURS.breakStart * 60 && slotStart < BUSINESS_HOURS.breakEnd * 60) continue;
      if (slotEnd > BUSINESS_HOURS.breakStart * 60 && slotStart < BUSINESS_HOURS.breakEnd * 60) continue;

      let isAvailable = true;
      for (const booked of bookedAppointments) {
        const bookedStart = timeToMinutes(booked.startTime);
        const bookedEnd = bookedStart + booked.service.duration;

        if (!(slotEnd <= bookedStart || slotStart >= bookedEnd)) {
          isAvailable = false;
          break;
        }
      }
      if (isAvailable) availableSlots.push(slot);
    }
    return availableSlots;
  } catch (error) {
    console.error('getAvailableSlots error:', error);
    return [];
  }
}
module.exports = { getAvailableSlots };