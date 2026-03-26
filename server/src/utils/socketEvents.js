const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Service = require('../models/Service');
const database = require('../config/database');

const services = [
  { name: 'Classic Haircut', duration: 30, price: 299, description: 'Professional haircut with styling' },
  { name: 'Beard Trim', duration: 20, price: 149, description: 'Expert beard shaping and trim' },
  { name: 'Haircut + Beard', duration: 50, price: 399, description: 'Complete grooming package' },
  { name: 'Hot Towel Shave', duration: 25, price: 199, description: 'Luxury hot towel shave' },
  { name: 'Kids Haircut', duration: 25, price: 199, description: 'Special haircut for kids' },
  { name: 'Hair Color', duration: 90, price: 999, description: 'Professional hair coloring' }
];

const seedDatabase = async () => {
  try {
    await database.connect();
    
    // Clear existing data
    await User.deleteMany();
    await Service.deleteMany();
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@salonpro.com',
      password: adminPassword,
      role: 'admin',
      phone: '9999999999'
    });
    
    // Create barber
    const barberPassword = await bcrypt.hash('barber123', 10);
    const barber = await User.create({
      name: 'Raj Kumar',
      email: 'raj@salonpro.com',
      password: barberPassword,
      role: 'barber',
      phone: '8888888888',
      isActive: true
    });
    
    // Create services
    await Service.insertMany(services);
    
    console.log('Database seeded successfully!');
    console.log('Admin login: admin@salonpro.com / admin123');
    console.log('Barber login: raj@salonpro.com / barber123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();