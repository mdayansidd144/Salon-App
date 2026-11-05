const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Resend } = require('resend');

// Safely initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Save to database
    await Contact.create({ name, email, phone, message });
    console.log("Message saved to database successfully.");

    // 2. Send email via Resend if API key exists
    if (resend) {
      console.log("Attempting to send email via Resend...");
      const emailResponse = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.EMAIL_USER,
        subject: `New Message from ${name} - Cut For You`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          
          Message:
          ${message}
        `
      });
      console.log("Resend API Response:", emailResponse);
    } else {
      console.log("Skipped email: RESEND_API_KEY is missing from environment variables.");
    }

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error("Contact form error:", error.message);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;