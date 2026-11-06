const mongoose = require('mongoose');
const logger = require('../middlewares/logger');

/**
 * Database Connection Class
 * Handles MongoDB connection with proper error handling
 */
class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.uri = null;
    this.connectPromise = null;

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', {
        name: error.name,
        message: error.message
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB connection re-established');
    });
  }

  /**
   * Connect to MongoDB
   * @param {string} uri - MongoDB connection string
   * @returns {Promise<void>}
   */
  async connect(uri) {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    this.uri = uri;

    if (mongoose.connection.readyState === 1) {
      this.connection = mongoose.connection;
      return this.connection;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryReads: true,
      retryWrites: true
    };

    this.connectPromise = mongoose.connect(uri, options)
      .then((connection) => {
        this.connection = connection.connection;
        logger.info('MongoDB connection established', {
          host: connection.connection.host,
          database: connection.connection.name
        });
        return connection;
      })
      .catch((error) => {
        logger.error('MongoDB connection failed', {
          name: error.name,
          message: error.message
        });
        throw error;
      })
      .finally(() => {
        this.connectPromise = null;
      });

    return this.connectPromise;
  }

  /**
   * Ensure requests use the single managed connection.
   * @returns {Promise<void>}
   */
  async ensureConnected() {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (!this.uri) {
      throw new Error('MongoDB connection has not been configured');
    }

    await this.connect(this.uri);
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      await mongoose.disconnect();
      this.connection = null;
      logger.info('MongoDB connection closed');
    } catch (error) {
      console.error('❌ MongoDB Disconnection Failed:', error.message);
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns {boolean}
   */
  isConnected() {
    return mongoose.connection.readyState === 1;
  }

  getStatus() {
    return {
      readyState: mongoose.connection.readyState,
      isConnected: this.isConnected(),
      host: mongoose.connection.host || null,
      database: mongoose.connection.name || null
    };
  }
}

// Export singleton instance
module.exports = new DatabaseConnection();
