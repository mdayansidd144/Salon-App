const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');
const rateLimiter = require('../middleware/rateLimiter');

// Public routes (booking)
router.post(
  '/',
  rateLimiter({ windowMs: 60 * 1000, max: 5 }), // 5 bookings per minute
  validateAppointment,
  appointmentController.createAppointment
);

router.get('/available-slots/:date', appointmentController.getAvailableSlots);

// Protected routes (authenticated users)
router.use(protect);

router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.cancelAppointment);
router.post('/:id/reschedule', appointmentController.rescheduleAppointment);
router.post('/:id/feedback', appointmentController.addFeedback);

// Admin only routes
router.use(authorize('admin', 'super_admin'));

router.get('/stats/dashboard', appointmentController.getDashboardStats);
router.get('/stats/revenue', appointmentController.getRevenueChart);
router.get('/export', appointmentController.exportAppointments);
router.post('/bulk', appointmentController.bulkCreateAppointments);
router.put('/:id/override', appointmentController.overrideAppointment);

module.exports = router;