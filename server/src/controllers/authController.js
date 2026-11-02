const User = require('../models/User');
const jwt = require('jsonwebtoken');

const seedAdmin = async () => {
  try {
    // 1. Create Admin
    const admin = await User.findOne({ email: 'cut-for-you@salon.com' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'cut-for-you@salon.com',
        password: 'admin123',
        role: 'admin',
        phone: '0000000000'
      });
      console.log('✅ Admin created');
    }

    // 2. Create Groomer Umar
    const umar = await User.findOne({ email: 'umar@salon.com' });
    if (!umar) {
      await User.create({
        name: 'Mohd Umar',
        email: 'umar@salon.com',
        password: 'umar@123',
        role: 'groomer',
        phone: '9519159639'
      });
      console.log('✅ Groomer Umar created');
    }

    // 3. Create Groomer Arish
    const arish = await User.findOne({ email: 'arish@salon.com' });
    if (!arish) {
      await User.create({
        name: 'Mohd Arish',
        email: 'arish@salon.com',
        password: 'arish@123',
        role: 'groomer',
        phone: '6393790278'
      });
      console.log('✅ Groomer Arish created');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

exports.seedAdmin = seedAdmin;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_key', {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '' // <-- ADD THIS
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};