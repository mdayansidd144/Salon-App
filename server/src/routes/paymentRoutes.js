const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
router.post('/create-order', async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
        console.log("💰 Creating order for amount:", amount);
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `receipt_${appointmentId}`,
    payment_capture: 1,
    notes: { 
    }
  };

    const order = await razorpay.orders.create(options);
        await Appointment.findByIdAndUpdate(appointmentId, {
      'payment.razorpayOrderId': order.id
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        'payment.status': 'paid',
        'payment.razorpayPaymentId': razorpay_payment_id,
        'payment.razorpaySignature': razorpay_signature,
        'payment.paidAt': new Date(),
        status: 'confirmed'
      });
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;