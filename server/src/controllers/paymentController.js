const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Appointment = require('../models/Appointment');
const { sendSMS, notifyAllBarbers } = require('../services/smsService');
exports.createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const options = {
      amount: Math.round(appointment.service.price * 100),
      currency: 'INR',
      receipt: `rcpt_${appointmentId}`,
      notes: { appointmentId }
    };

    const order = await razorpay.orders.create(options);
    appointment.payment.razorpayOrderId = order.id;
    await appointment.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (appointment) {
      appointment.payment.status = 'paid';
      appointment.payment.razorpayPaymentId = razorpay_payment_id;
      appointment.payment.razorpaySignature = razorpay_signature;
      appointment.payment.paidAt = new Date();
      appointment.status = 'confirmed';
      await appointment.save();

      const formattedDate = new Date(appointment.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      const customerMessage = `Payment confirmed! Salon Pro: Your ${appointment.service.name} appointment on ${formattedDate} at ${appointment.startTime} is CONFIRMED. Amount paid: ₹${appointment.payment.amount}`;
      await sendSMS(appointment.customer.phone, customerMessage);

      const barberMessage = `PAYMENT RECEIVED!\nCustomer: ${appointment.customer.name}\nService: ${appointment.service.name}\nDate: ${formattedDate}\nTime: ${appointment.startTime}\nAmount: ₹${appointment.payment.amount}`;
      await notifyAllBarbers(barberMessage);
    }

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};