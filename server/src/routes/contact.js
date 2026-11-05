const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create a quick schema for the contact messages
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compile the model (or use it if it already exists)
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// POST route to receive the message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Save to database
    const newMessage = await Contact.create({
      name,
      email,
      phone,
      message
    });

    console.log("New contact message received:", newMessage);

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error("Contact form error:", error.message);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;