const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todayBookings = await Appointment.countDocuments({ 
      date: { $gte: new Date(today) }, 
      status: { $ne: 'cancelled' } 
    });
    
    const totalBookings = await Appointment.countDocuments({ 
      status: { $ne: 'cancelled' } 
    });
    
    const revenueResult = await Appointment.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        totalRevenue: revenueResult[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;