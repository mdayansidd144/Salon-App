const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
    await Contact.create({ name, email, phone, message });
    
    console.log("Message saved to database successfully.");
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error("Contact form error:", error.message);
    res.status(500).json({ success: false, message: 'Failed to save message.' });
  }
});

module.exports = router;