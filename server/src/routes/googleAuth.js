const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        password: googleId, 
        phone: '0000000000', 
        role: 'customer', 
        avatar: picture // Save picture for new users
      });
      console.log("New user created from Google:", email);
    } else if (picture && !user.avatar) {
      // If user exists but has no avatar, update it
      user.avatar = picture;
      await user.save();
      console.log("Google picture updated for existing user:", email);
    }

    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: appToken,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        avatar: user.avatar // Send the picture to frontend
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(401).json({ success: false, message: 'Google verification failed' });
  }
});

module.exports = router;