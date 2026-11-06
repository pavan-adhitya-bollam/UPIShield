require('dotenv').config();
const app = require('./app');
const db = require('./database/connection');
const { Logger } = require('./utils');
const { verifyConnection } = require('./services/emailService');

// Set port
const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await db.connect(process.env.MONGODB_URI);

    server = app.listen(PORT, () => {
      Logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    verifyConnection()
      .then(() => Logger.info('Brevo SMTP service ready for delivery'))
      .catch((err) => Logger.warn('Brevo SMTP service verification warning', { message: err.message }));
  } catch (error) {
    Logger.error('Server failed to start', { message: error.message });
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled promise rejection', { message: err.message, stack: err.stack });
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  Logger.error('Uncaught exception', { message: err.message, stack: err.stack });
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  if (server) {
    server.close(() => process.exit(0));
  }
});

process.on('SIGINT', () => {
  if (server) {
    server.close(() => process.exit(0));
  }
});

startServer();
