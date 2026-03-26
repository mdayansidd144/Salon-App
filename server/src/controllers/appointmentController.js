const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const NotificationService = require('../services/notificationService');
const WebSocketService = require('../services/websocketService');
const Analytics = require('../models/Analytics');
const logger = require('../config/logger');
const redisClient = require('../config/redis');

class AppointmentController {
  // Create appointment with real-time availability check
  async createAppointment(req, res) {
    try {
      const { customer, serviceId, date, timeSlot, notes } = req.body;

      // Check service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      // Calculate end time
      const [hour, minute] = timeSlot.split(':');
      const startMinutes = parseInt(hour) * 60 + parseInt(minute);
      const endMinutes = startMinutes + service.duration;
      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

      // Check availability with Redis lock to prevent double booking
      const lockKey = `lock:appointment:${date}:${timeSlot}`;
      const locked = await redisClient.set(lockKey, 'locked', 'EX', 30, 'NX');
      
      if (!locked) {
        return res.status(409).json({ 
          success: false, 
          message: 'This slot is being booked by someone else. Please try again.' 
        });
      }

      try {
        // Double-check database for existing booking
        const existing = await Appointment.findOne({
          date: new Date(date),
          startTime: timeSlot,
          status: { $nin: ['cancelled', 'no_show'] }
        });

        if (existing) {
          await redisClient.del(lockKey);
          return res.status(400).json({ 
            success: false, 
            message: 'This time slot is already booked' 
          });
        }

        // Create appointment
        const appointment = await Appointment.create({
          customer,
          service: {
            id: serviceId,
            name: service.name,
            price: service.price,
            duration: service.duration
          },
          barber: {
            id: service.barberId || (await this.getNextAvailableBarber(date, timeSlot)),
            name: ''
          },
          date: new Date(date),
          startTime: timeSlot,
          endTime,
          duration: service.duration,
          payment: { amount: service.price, status: 'pending' },
          analytics: {
            deviceType: req.headers['user-agent'],
            browser: req.headers['user-agent'],
            location: {
              ip: req.ip
            }
          }
        });

        // Populate barber details
        await appointment.populate('barber.id', 'name email phone');
        
        // Send real-time notification via WebSocket
        WebSocketService.sendToUser(appointment.barber.id, 'new-booking', appointment);
        WebSocketService.broadcastToAdmins('new-booking', appointment);

        // Send email and SMS confirmations
        await NotificationService.sendAppointmentConfirmation(appointment);

        // Clear cache
        await redisClient.clearPattern(`slots:${date}:*`);
        await redisClient.del(lockKey);

        // Update analytics
        await Analytics.findOneAndUpdate(
          { date: new Date().setHours(0, 0, 0, 0) },
          { $inc: { 'metrics.totalBookings': 1, 'metrics.newCustomers': 1 } },
          { upsert: true }
        );

        res.status(201).json({
          success: true,
          data: appointment,
          message: 'Appointment booked successfully!'
        });

      } catch (error) {
        await redisClient.del(lockKey);
        throw error;
      }

    } catch (error) {
      logger.error('Create appointment error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get appointments with caching
  async getAppointments(req, res) {
    try {
      const { date, status, barberId, page = 1, limit = 20 } = req.query;
      
      // Build cache key
      const cacheKey = `appointments:${date}:${status}:${barberId}:${page}:${limit}`;
      
      // Try to get from cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json({ success: true, ...cached });
      }

      // Build query
      let query = {};
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        query.date = { $gte: startDate, $lt: endDate };
      }
      if (status) query.status = status;
      if (barberId) query['barber.id'] = barberId;

      const skip = (page - 1) * limit;
      
      const [appointments, total] = await Promise.all([
        Appointment.find(query)
          .populate('service.id', 'name price duration')
          .populate('barber.id', 'name email phone')
          .sort({ date: 1, startTime: 1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Appointment.countDocuments(query)
      ]);

      const result = {
        data: appointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };

      // Cache for 5 minutes
      await redisClient.set(cacheKey, result, 300);

      res.json({ success: true, ...result });

    } catch (error) {
      logger.error('Get appointments error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get available slots with real-time updates
  async getAvailableSlots(req, res) {
    try {
      const { date } = req.params;
      const { serviceId } = req.query;
      
      // Get service duration
      let duration = 30; // default
      if (serviceId) {
        const service = await Service.findById(serviceId);
        if (service) duration = service.duration;
      }

      // Check cache first
      const cacheKey = `slots:${date}:${duration}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();
      
      // Get business hours from settings (configurable)
      const businessHours = {
        start: 9, // 9 AM
        end: 19,  // 7 PM
        slotDuration: 30
      };

      // Generate all possible slots
      const allSlots = [];
      let currentTime = businessHours.start * 60;
      const endTime = businessHours.end * 60;
      
      while (currentTime + duration <= endTime) {
        const hour = Math.floor(currentTime / 60);
        const minute = currentTime % 60;
        allSlots.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          startMinutes: currentTime,
          endMinutes: currentTime + duration
        });
        currentTime += businessHours.slotDuration;
      }

      // Get booked appointments
      const booked = await Appointment.find({
        date: {
          $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
          $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
        },
        status: { $nin: ['cancelled', 'no_show'] }
      });

      // Check availability for each slot
      const availableSlots = [];
      for (const slot of allSlots) {
        let isAvailable = true;
        
        for (const booking of booked) {
          const [bookHour, bookMinute] = booking.startTime.split(':');
          const bookStart = parseInt(bookHour) * 60 + parseInt(bookMinute);
          const bookEnd = bookStart + booking.duration;
          
          if (!(slot.endMinutes <= bookStart || slot.startMinutes >= bookEnd)) {
            isAvailable = false;
            break;
          }
        }
        
        if (isAvailable) {
          availableSlots.push(slot.time);
        }
      }

      // Cache for 30 seconds (real-time)
      await redisClient.set(cacheKey, availableSlots, 30);

      res.json({ 
        success: true, 
        data: availableSlots,
        duration,
        businessHours
      });

    } catch (error) {
      logger.error('Get available slots error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Cancel appointment with notifications
  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const { reason, cancelledBy = 'customer' } = req.body;

      const appointment = await Appointment.findById(id)
        .populate('customer')
        .populate('barber.id', 'name email phone')
        .populate('service.id', 'name price');

      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      // Check cancellation policy (e.g., 24 hours before)
      const appointmentTime = new Date(appointment.date);
      appointmentTime.setHours(parseInt(appointment.startTime.split(':')[0]));
      const hoursUntilAppointment = (appointmentTime - new Date()) / (1000 * 60 * 60);
      
      if (hoursUntilAppointment < 24 && cancelledBy === 'customer') {
        return res.status(400).json({ 
          success: false, 
          message: 'Cancellations must be made at least 24 hours in advance' 
        });
      }

      // Update appointment
      appointment.status = 'cancelled';
      appointment.cancelledBy = cancelledBy;
      appointment.cancellationReason = reason;
      appointment.cancelledAt = new Date();
      await appointment.save();

      // Send cancellation notifications
      await NotificationService.sendCancellationNotification(appointment);
      
      // Real-time updates
      WebSocketService.sendToUser(appointment.barber.id, 'booking-cancelled', appointment);
      WebSocketService.broadcastToAdmins('booking-cancelled', appointment);
      
      // Clear cache
      const dateStr = appointment.date.toISOString().split('T')[0];
      await redisClient.clearPattern(`slots:${dateStr}:*`);
      await redisClient.clearPattern(`appointments:*`);

      // If payment was made, process refund
      if (appointment.payment.status === 'paid') {
        await this.processRefund(appointment);
      }

      res.json({ 
        success: true, 
        message: 'Appointment cancelled successfully',
        refundProcessed: appointment.payment.status === 'paid'
      });

    } catch (error) {
      logger.error('Cancel appointment error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Reschedule appointment
  async rescheduleAppointment(req, res) {
    try {
      const { id } = req.params;
      const { newDate, newTimeSlot, reason } = req.body;

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      // Check availability of new slot
      const existing = await Appointment.findOne({
        date: new Date(newDate),
        startTime: newTimeSlot,
        status: { $nin: ['cancelled', 'no_show'] },
        _id: { $ne: id }
      });

      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'New time slot is not available' 
        });
      }

      // Calculate new end time
      const [hour, minute] = newTimeSlot.split(':');
      const startMinutes = parseInt(hour) * 60 + parseInt(minute);
      const endMinutes = startMinutes + appointment.duration;
      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

      // Save reschedule history
      appointment.rescheduleHistory.push({
        oldDate: appointment.date,
        oldTime: appointment.startTime,
        newDate: new Date(newDate),
        newTime: newTimeSlot,
        reason,
        rescheduledAt: new Date()
      });

      // Update appointment
      appointment.date = new Date(newDate);
      appointment.startTime = newTimeSlot;
      appointment.endTime = endTime;
      appointment.status = 'pending'; // Requires re-confirmation
      await appointment.save();

      // Send notifications
      await NotificationService.sendRescheduleNotification(appointment);
      
      // Real-time updates
      WebSocketService.sendToUser(appointment.barber.id, 'booking-rescheduled', appointment);
      WebSocketService.broadcastToAdmins('booking-rescheduled', appointment);

      res.json({ 
        success: true, 
        data: appointment,
        message: 'Appointment rescheduled successfully' 
      });

    } catch (error) {
      logger.error('Reschedule appointment error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Process refund
  async processRefund(appointment) {
    try {
      const RazorpayService = require('../services/razorpayService');
      const refund = await RazorpayService.refundPayment(appointment.payment.transactionId);
      
      appointment.payment.status = 'refunded';
      appointment.payment.refundId = refund.id;
      appointment.payment.refundedAt = new Date();
      await appointment.save();
      
      logger.info(`Refund processed for appointment ${appointment._id}: ${refund.id}`);
      return refund;
    } catch (error) {
      logger.error('Refund processing failed:', error);
    }
  }

  // Get next available barber (round-robin)
  async getNextAvailableBarber(date, timeSlot) {
    // Implementation for barber assignment
    const User = require('../models/User');
    const barbers = await User.find({ role: 'barber', isActive: true });
    
    if (barbers.length === 0) return null;
    
    // Simple round-robin selection based on least bookings
    const bookings = await Appointment.aggregate([
      { $match: { date: new Date(date), status: { $ne: 'cancelled' } } },
      { $group: { _id: '$barber.id', count: { $sum: 1 } } }
    ]);
    
    const bookingMap = new Map(bookings.map(b => [b._id.toString(), b.count]));
    const availableBarbers = barbers.filter(b => (bookingMap.get(b._id.toString()) || 0) < 10); // Max 10 bookings per barber
    
    if (availableBarbers.length === 0) return barbers[0]._id;
    
    // Return barber with least bookings
    return availableBarbers.reduce((min, barber) => {
      const count = bookingMap.get(barber._id.toString()) || 0;
      return count < (bookingMap.get(min._id.toString()) || 0) ? barber : min;
    })._id;
  }
}

module.exports = new AppointmentController();