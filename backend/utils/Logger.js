const winston = require('winston');
const path = require('path');

/**
 * Logger Utility Class
 * Professional logging using Winston with multiple transports
 */
class Logger {
  constructor() {
    this.logger = this.createLogger();
  }

  /**
   * Create Winston logger instance
   * @returns {winston.Logger}
   */
  createLogger() {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
          msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
      })
    );

    const transports = [
      // Console transport
      new winston.transports.Console({
        format: consoleFormat,
        level: process.env.LOG_LEVEL || 'info'
      }),
      // Error log file
      new winston.transports.File({
        filename: path.join(__dirname, '../logs/error.log'),
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      // Combined log file
      new winston.transports.File({
        filename: path.join(__dirname, '../logs/combined.log'),
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ];

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      defaultMeta: { service: 'upi-fraud-detection' },
      transports,
      exitOnError: false
    });
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  info(message, metadata = {}) {
    this.logger.info(message, metadata);
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  warn(message, metadata = {}) {
    this.logger.warn(message, metadata);
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  error(message, metadata = {}) {
    this.logger.error(message, metadata);
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  debug(message, metadata = {}) {
    this.logger.debug(message, metadata);
  }

  /**
   * Create a stream for Morgan
   * @returns {Object}
   */
  stream() {
    return {
      write: (message) => {
        this.info(message.trim());
      }
    };
  }
}

// Export singleton instance
module.exports = new Logger();
