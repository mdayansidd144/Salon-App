const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// Setup Nodemailer using the env variables you provided
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Save to database
    await Contact.create({ name, email, phone, message });

    // 2. Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sends the email to your own inbox (ayansiddiqui1411@gmail.com)
      subject: `New Message from ${name} - Cut For You`,
      text: `
        You have received a new message from the website contact form.
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        
        Message:
        ${message}
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Contact email sent successfully to:", process.env.EMAIL_USER);

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    // This will print the EXACT error in your Render logs if Gmail blocks it
    console.error("Contact form error:", error.message);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;