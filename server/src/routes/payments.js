const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ============ STEP 1: CREATE ORDER ============
// This endpoint is called when customer clicks "Pay"
router.post('/create-order', async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;

    // Create order in Razorpay
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (₹100 = 10000 paise)
      currency: 'INR',
      receipt: appointmentId, // Link order to appointment
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    // Save order ID to database
    await Appointment.findByIdAndUpdate(appointmentId, {
      'payment.orderId': order.id,
      'payment.status': 'pending'
    });

    // Send order details to frontend
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// ============ STEP 2: VERIFY PAYMENT ============
// This endpoint is called after customer pays
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,    // Order ID from Razorpay
      razorpay_payment_id,  // Payment ID from Razorpay
      razorpay_signature,   // Signature for verification
      appointmentId         // Your appointment ID
    } = req.body;

    // ============ VERIFICATION FORMULA ============
    // Create a string: order_id + "|" + payment_id
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    
    // Generate expected signature using your secret key
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Compare signatures
    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      });
    }

    // ============ PAYMENT IS VERIFIED! ============
    // Update appointment in database
    const appointment = await Appointment.findById(appointmentId);
    
    if (appointment) {
      appointment.payment.status = 'paid';
      appointment.payment.transactionId = razorpay_payment_id;
      appointment.payment.paidAt = new Date();
      appointment.status = 'confirmed';
      await appointment.save();

      // Send SMS to customer
      await smsService.sendPaymentConfirmation(appointment.customer, appointment);
      
      // Send SMS to barber
      await smsService.notifyBarber({
        customerName: appointment.customer.name,
        customerPhone: appointment.customer.phone,
        serviceName: appointment.serviceName,
        date: appointment.date.toISOString().split('T')[0],
        timeSlot: appointment.timeSlot,
        amount: appointment.payment.amount
      });
    }

    res.json({ 
      success: true, 
      message: 'Payment verified successfully!' 
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});