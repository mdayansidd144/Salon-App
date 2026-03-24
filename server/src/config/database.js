const mongoose = require('mongoose');
const logger = require('./logger');

class Database {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;

    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      logger.info(`MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      logger.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    if (!this.isConnected) return;
    
    await mongoose.disconnect();
    this.isConnected = false;
    logger.info('MongoDB disconnected');
  }
}

module.exports = new Database();