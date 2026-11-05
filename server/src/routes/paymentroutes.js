const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Safely initialize Razorpay so it doesn't crash the server on startup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id_to_prevent_crash',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret'
});

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Payment routes are working.' });
});

router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;