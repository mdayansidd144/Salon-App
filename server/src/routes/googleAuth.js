const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // 2. Find user in database
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google picture
      user = await User.create({
        name: name,
        email: email,
        password: googleId, 
        phone: '0000000000', 
        role: 'customer', 
        avatar: picture 
      });
      console.log("👤 New user created with Google picture:", email);
    } else if (picture && !user.avatar) {
      // IMPORTANT: If user exists but has no picture, update it
      user.avatar = picture;
      await user.save();
      console.log("🖼️ Google picture updated for existing user:", email);
    }

    // 3. Create JWT
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
        avatar: user.avatar // Send the picture URL to frontend
      }
    });

  } catch (error) {
    console.error("❌ Google Auth Error:", error.message);
    res.status(401).json({ success: false, message: 'Google verification failed' });
  }
});

module.exports = router;