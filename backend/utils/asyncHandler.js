const ApiError = require('./ApiError');

/**
 * Async Handler Utility
 * Wraps async route handlers to automatically catch errors and pass them to error middleware
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Async Handler with Custom Error Handling
 * Wraps async route handlers and converts non-ApiError errors to ApiError
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandlerWithError = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // Convert non-ApiError errors to ApiError
      if (!(error instanceof ApiError)) {
        if (error.name === 'ValidationError') {
          return next(ApiError.unprocessableEntity(error.message, error.errors));
        }
        if (error.name === 'CastError') {
          return next(ApiError.badRequest('Invalid ID format'));
        }
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern)[0];
          return next(ApiError.conflict(`${field} already exists`));
        }
        if (error.name === 'JsonWebTokenError') {
          return next(ApiError.unauthorized('Invalid token'));
        }
        if (error.name === 'TokenExpiredError') {
          return next(ApiError.unauthorized('Token expired'));
        }
        // Default to internal server error
        return next(ApiError.internal(error.message));
      }
      next(error);
    }
  };
};

module.exports = {
  asyncHandler,
  asyncHandlerWithError
};
