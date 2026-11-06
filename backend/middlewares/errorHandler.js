const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('./logger');

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = err;
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  if (!(error instanceof ApiError)) {
    error = new ApiError(statusCode, message, errors || []);
  }

  if ([
    'MongoServerSelectionError',
    'MongoNetworkError',
    'MongoNotConnectedError',
    'MongoTopologyClosedError'
  ].includes(err.name)) {
    statusCode = 503;
    message = 'Database temporarily unavailable. Please try again shortly.';
    error = new ApiError(statusCode, message);
  }

  logger.error(message, {
    statusCode,
    method: req.method,
    path: req.originalUrl,
    stack: err.stack
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
    errors = null;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate field value entered';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  return res.status(statusCode).json({
    ...ApiResponse.error(statusCode, message, errors),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
