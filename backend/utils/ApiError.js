const { httpStatusCodes } = require('../constants');

/**
 * ApiError Class
 * Custom error class for API responses with proper HTTP status codes
 */
class ApiError extends Error {
  /**
   * Create an ApiError instance
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors array (optional)
   * @param {boolean} isOperational - Whether the error is operational (true) or programming error (false)
   */
  constructor(statusCode, message, errors = [], isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Create a BAD_REQUEST (400) error
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors
   * @returns {ApiError}
   */
  static badRequest(message, errors = []) {
    return new ApiError(httpStatusCodes.BAD_REQUEST, message, errors);
  }

  /**
   * Create an UNAUTHORIZED (401) error
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static unauthorized(message = 'Unauthorized access') {
    return new ApiError(httpStatusCodes.UNAUTHORIZED, message);
  }

  /**
   * Create a FORBIDDEN (403) error
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static forbidden(message = 'Access forbidden') {
    return new ApiError(httpStatusCodes.FORBIDDEN, message);
  }

  /**
   * Create a NOT_FOUND (404) error
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static notFound(message = 'Resource not found') {
    return new ApiError(httpStatusCodes.NOT_FOUND, message);
  }

  /**
   * Create a CONFLICT (409) error
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static conflict(message = 'Resource already exists') {
    return new ApiError(httpStatusCodes.CONFLICT, message);
  }

  /**
   * Create an UNPROCESSABLE_ENTITY (422) error
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors
   * @returns {ApiError}
   */
  static unprocessableEntity(message, errors = []) {
    return new ApiError(httpStatusCodes.UNPROCESSABLE_ENTITY, message, errors);
  }

  /**
   * Create a TOO_MANY_REQUESTS (429) error
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(httpStatusCodes.TOO_MANY_REQUESTS, message);
  }

  /**
   * Create an INTERNAL_SERVER_ERROR (500) error
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static internal(message = 'Internal server error') {
    return new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR, message, [], false);
  }

  /**
   * Create a SERVICE_UNAVAILABLE (503) error
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static serviceUnavailable(message = 'Service temporarily unavailable') {
    return new ApiError(httpStatusCodes.SERVICE_UNAVAILABLE, message);
  }
}

module.exports = ApiError;
