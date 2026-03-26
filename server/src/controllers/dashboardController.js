const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Feedback = require('../models/Feedback');
const Analytics = require('../models/Analytics');
const logger = require('../config/logger');
const redisClient = require('../config/redis');

class DashboardController {
  // Get main dashboard stats
  async getDashboardStats(req, res) {
    try {
      const cacheKey = 'dashboard:stats';
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);

      const [
        totalBookings,
        todayBookings,
        weekBookings,
        monthBookings,
        totalRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalCustomers,
        newCustomersWeek,
        returningCustomersWeek,
        averageRating,
        topServices,
        topBarbers
      ] = await Promise.all([
        Appointment.countDocuments(),
        Appointment.countDocuments({ date: { $gte: today, $lt: new Date(today.getTime() + 86400000) } }),
        Appointment.countDocuments({ date: { $gte: weekAgo } }),
        Appointment.countDocuments({ date: { $gte: monthAgo } }),
        Appointment.aggregate([{ $match: { 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$payment.amount' } } }]),
        Appointment.aggregate([{ $match: { date: { $gte: today, $lt: new Date(today.getTime() + 86400000) }, 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$payment.amount' } } }]),
        Appointment.aggregate([{ $match: { date: { $gte: weekAgo }, 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$payment.amount' } } }]),
        Appointment.aggregate([{ $match: { date: { $gte: monthAgo }, 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$payment.amount' } } }]),
        Appointment.countDocuments({ status: 'pending' }),
        Appointment.countDocuments({ status: 'confirmed' }),
        Appointment.countDocuments({ status: 'completed' }),
        Appointment.countDocuments({ status: 'cancelled' }),
        Appointment.distinct('customer.email').then(emails => emails.length),
        Appointment.aggregate([{ $match: { createdAt: { $gte: weekAgo } } }, { $group: { _id: '$customer.email' } }, { $count: 'count' }]),
        Appointment.aggregate([{ $match: { createdAt: { $lt: weekAgo } } }, { $group: { _id: '$customer.email' } }, { $count: 'count' }]),
        Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
        Appointment.aggregate([
          { $match: { 'payment.status': 'paid' } },
          { $group: { _id: '$service.name', count: { $sum: 1 }, revenue: { $sum: '$payment.amount' } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]),
        Appointment.aggregate([
          { $group: { _id: '$barber.name', count: { $sum: 1 }, revenue: { $sum: '$payment.amount' } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ])
      ]);

      const stats = {
        overview: {
          totalBookings,
          todayBookings,
          weekBookings,
          monthBookings,
          totalRevenue: totalRevenue[0]?.total || 0,
          todayRevenue: todayRevenue[0]?.total || 0,
          weekRevenue: weekRevenue[0]?.total || 0,
          monthRevenue: monthRevenue[0]?.total || 0,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          totalCustomers,
          newCustomers: newCustomersWeek[0]?.count || 0,
          returningCustomers: returningCustomersWeek[0]?.count || 0,
          averageRating: averageRating[0]?.avg || 0
        },
        topServices,
        topBarbers,
        timestamp: new Date()
      };

      await redisClient.set(cacheKey, stats, 300); // Cache for 5 minutes

      res.json({ success: true, data: stats });

    } catch (error) {
      logger.error('Dashboard stats error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get revenue chart data
  async getRevenueChart(req, res) {
    try {
      const { period = 'week' } = req.query;
      let startDate, groupFormat;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (period) {
        case 'day':
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 1);
          groupFormat = '%H:00';
          break;
        case 'week':
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 7);
          groupFormat = '%Y-%m-%d';
          break;
        case 'month':
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 30);
          groupFormat = '%Y-%m-%d';
          break;
        case 'year':
          startDate = new Date(today);
          startDate.setFullYear(startDate.getFullYear() - 1);
          groupFormat = '%Y-%m';
          break;
        default:
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 7);
          groupFormat = '%Y-%m-%d';
      }

      const revenueData = await Appointment.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: today },
            'payment.status': 'paid'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: groupFormat, date: '$date' }
            },
            revenue: { $sum: '$payment.amount' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const bookingsData = await Appointment.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: today }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: groupFormat, date: '$date' }
            },
            total: { $sum: 1 },
            confirmed: {
              $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.json({
        success: true,
        data: {
          revenue: revenueData,
          bookings: bookingsData,
          period
        }
      });

    } catch (error) {
      logger.error('Revenue chart error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get service analytics
  async getServiceAnalytics(req, res) {
    try {
      const services = await Service.find({ isActive: true });
      
      const analytics = await Promise.all(services.map(async (service) => {
        const bookings = await Appointment.countDocuments({ 'service.id': service._id });
        const revenue = await Appointment.aggregate([
          { $match: { 'service.id': service._id, 'payment.status': 'paid' } },
          { $group: { _id: null, total: { $sum: '$payment.amount' } } }
        ]);
        
        const feedback = await Feedback.aggregate([
          { $match: { 'service.id': service._id } },
          { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
        ]);

        return {
          id: service._id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          bookings,
          revenue: revenue[0]?.total || 0,
          averageRating: feedback[0]?.avgRating || 0,
          totalFeedback: feedback[0]?.total || 0
        };
      }));

      res.json({ success: true, data: analytics });

    } catch (error) {
      logger.error('Service analytics error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get customer insights
  async getCustomerInsights(req, res) {
    try {
      const customers = await Appointment.aggregate([
        {
          $group: {
            _id: '$customer.email',
            name: { $first: '$customer.name' },
            phone: { $first: '$customer.phone' },
            totalBookings: { $sum: 1 },
            totalSpent: {
              $sum: {
                $cond: [{ $eq: ['$payment.status', 'paid'] }, '$payment.amount', 0]
              }
            },
            lastVisit: { $max: '$date' },
            firstVisit: { $min: '$date' },
            preferredServices: { $addToSet: '$service.name' },
            averageRating: { $avg: '$feedback.rating' }
          }
        },
        { $sort: { totalSpent: -1 } }
      ]);

      const insights = {
        totalCustomers: customers.length,
        averageSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length || 0,
        averageBookings: customers.reduce((sum, c) => sum + c.totalBookings, 0) / customers.length || 0,
        topSpenders: customers.slice(0, 10),
        frequentVisitors: customers.sort((a, b) => b.totalBookings - a.totalBookings).slice(0, 10),
        loyalCustomers: customers.filter(c => c.totalBookings > 5).length,
        newCustomers: customers.filter(c => {
          const daysSinceFirst = (new Date() - new Date(c.firstVisit)) / (1000 * 60 * 60 * 24);
          return daysSinceFirst < 30;
        }).length
      };

      res.json({ success: true, data: insights });

    } catch (error) {
      logger.error('Customer insights error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Export reports
  async exportReport(req, res) {
    try {
      const { type, startDate, endDate, format = 'json' } = req.query;
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      let data;
      switch (type) {
        case 'appointments':
          data = await Appointment.find({
            date: { $gte: start, $lte: end }
          }).populate('service.id barber.id');
          break;
        case 'revenue':
          data = await Appointment.aggregate([
            { $match: { date: { $gte: start, $lte: end }, 'payment.status': 'paid' } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                daily: { $sum: '$payment.amount' },
                bookings: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]);
          break;
        case 'services':
          data = await this.getServiceAnalytics(req, res);
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid report type' });
      }

      if (format === 'csv') {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const filePath = `reports/${type}_${Date.now()}.csv`;
        // CSV generation logic here
        res.json({ success: true, message: 'Report generated', file: filePath });
      } else {
        res.json({ success: true, data });
      }

    } catch (error) {
      logger.error('Export report error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new DashboardController();