const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const Appointment = require('../models/Appointment');
const redisClient = require('../config/redis');

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });
    
    this.connectedUsers = new Map();
    this.initialize();
  }

  initialize() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication required'));
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
      } catch (err) {
        next(new Error('Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.userId}`);
      this.connectedUsers.set(socket.userId, socket.id);
      
      // Join user's room for private messages
      socket.join(`user:${socket.userId}`);
      
      // Join admin room if user is admin
      if (socket.userRole === 'admin') {
        socket.join('admin-room');
      }

      this.setupEventHandlers(socket);
    });
  }

  setupEventHandlers(socket) {
    // Handle real-time booking updates
    socket.on('book-appointment', async (data) => {
      try {
        const appointment = await Appointment.findById(data.appointmentId)
          .populate('customer')
          .populate('service.id');
        
        // Broadcast to barber's room
        socket.to(`barber:${appointment.barber.id}`).emit('new-booking', appointment);
        
        // Broadcast to admin room
        this.io.to('admin-room').emit('new-booking', appointment);
        
        // Send confirmation to customer
        socket.emit('booking-confirmed', appointment);
      } catch (error) {
        socket.emit('booking-error', { message: error.message });
      }
    });

    // Handle real-time slot availability
    socket.on('check-availability', async ({ date, serviceId }) => {
      try {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        
        const bookings = await Appointment.find({
          date: { $gte: start, $lte: end },
          status: { $nin: ['cancelled', 'no_show'] }
        });
        
        const bookedSlots = bookings.map(b => b.startTime);
        const availableSlots = this.generateTimeSlots().filter(slot => !bookedSlots.includes(slot));
        
        socket.emit('availability-response', { date, availableSlots });
      } catch (error) {
        socket.emit('availability-error', { message: error.message });
      }
    });

    // Handle real-time appointment cancellation
    socket.on('cancel-appointment', async ({ appointmentId, reason }) => {
      try {
        const appointment = await Appointment.findById(appointmentId);
        appointment.status = 'cancelled';
        appointment.cancelledAt = new Date();
        appointment.cancellationReason = reason;
        await appointment.save();
        
        // Notify barber and admin
        socket.to(`barber:${appointment.barber.id}`).emit('booking-cancelled', appointment);
        this.io.to('admin-room').emit('booking-cancelled', appointment);
        
        // Notify customer
        socket.emit('cancellation-confirmed', appointment);
      } catch (error) {
        socket.emit('cancellation-error', { message: error.message });
      }
    });

    // Handle real-time appointment status updates
    socket.on('update-status', async ({ appointmentId, status }) => {
      try {
        const appointment = await Appointment.findByIdAndUpdate(
          appointmentId,
          { status },
          { new: true }
        ).populate('customer');
        
        // Notify customer
        socket.to(`user:${appointment.customer.id}`).emit('status-updated', appointment);
        
        // Broadcast to admin room
        this.io.to('admin-room').emit('status-updated', appointment);
        
        socket.emit('status-update-success', appointment);
      } catch (error) {
        socket.emit('status-update-error', { message: error.message });
      }
    });

    // Handle dashboard real-time updates
    socket.on('subscribe-dashboard', async () => {
      // Send initial stats
      const stats = await this.getDashboardStats();
      socket.emit('dashboard-stats', stats);
      
      // Set up interval for real-time updates
      const interval = setInterval(async () => {
        const newStats = await this.getDashboardStats();
        socket.emit('dashboard-stats-update', newStats);
      }, 30000); // Update every 30 seconds
      
      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
      this.connectedUsers.delete(socket.userId);
    });
  }

  generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour !== 19) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayBookings = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });
    
    const totalBookings = await Appointment.countDocuments();
    const pendingBookings = await Appointment.countDocuments({ status: 'pending' });
    const revenue = await Appointment.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);
    
    return {
      todayBookings,
      totalBookings,
      pendingBookings,
      revenue: revenue[0]?.total || 0,
      timestamp: new Date()
    };
  }

  // Broadcast to specific user
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Broadcast to all connected clients
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  // Broadcast to admin room
  broadcastToAdmins(event, data) {
    this.io.to('admin-room').emit(event, data);
  }
}

module.exports = WebSocketService;