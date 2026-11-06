const mongoose = require('mongoose');
const logger = require('../middlewares/logger');

const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', { message: error.message });
    });

    return conn;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { message: error.message });
    process.exit(1);
  }
};

module.exports = connectDatabase;
