const Appointment = require('../models/Appointment');
const razorpayService = require('../services/razorpayService');
const notificationService = require('../services/notificationService');
const logger = require('../config/logger');

exports.initiateRazorpayPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    const appointment = await Appointment.findById(appointmentId)
      .populate('service', 'name price')
      .populate('barber', 'name');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Create Razorpay order
    const order = await razorpayService.createOrder(
      appointment.payment.amount,
      appointment._id.toString(),
      {
        appointmentId: appointment._id.toString(),
        customerName: appointment.customer.name,
        customerEmail: appointment.customer.email
      }
    );

    // Update appointment with order ID
    appointment.payment.orderId = order.orderId;
    appointment.payment.method = 'razorpay';
    appointment.payment.status = 'pending';
    await appointment.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        appointmentId: appointment._id
      }
    });
  } catch (error) {
    logger.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId
    } = req.body;

    // Verify signature
    const isValid = razorpayService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get payment details
    const payment = await razorpayService.getPayment(razorpay_payment_id);
    
    // Update appointment
    const appointment = await Appointment.findById(appointmentId);
    if (appointment) {
      appointment.payment.status = 'paid';
      appointment.payment.transactionId = razorpay_payment_id;
      appointment.payment.paymentId = razorpay_payment_id;
      appointment.payment.paidAt = new Date();
      appointment.status = 'confirmed';
      await appointment.save();

      // Send confirmation notifications
      await notificationService.sendAppointmentConfirmation(appointment);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    logger.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.initiatePhonePePayment = async (req, res) => {
  try {
    const { appointmentId, mobileNumber } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const orderId = `SALON_${appointmentId}_${Date.now()}`;
    const amount = appointment.payment.amount;

    // PhonePe integration logic here
    const paymentUrl = await phonepeService.initiatePayment({
      amount,
      orderId,
      mobileNumber,
      appointmentId: appointment._id
    });

    appointment.payment.orderId = orderId;
    appointment.payment.method = 'phonepe';
    await appointment.save();

    res.status(200).json({
      success: true,
      paymentUrl,
      orderId
    });
  } catch (error) {
    logger.error('PhonePe payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};