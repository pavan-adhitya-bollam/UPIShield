const { httpStatusCodes } = require('../constants');

/**
 * ApiResponse Class
 * Standardized response format for API responses
 */
class ApiResponse {
  /**
   * Create a success response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @returns {Object}
   */
  static success(statusCode = httpStatusCodes.OK, message = 'Success', data = null) {
    return {
      success: true,
      statusCode,
      message,
      data,
      error: null,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create an error response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors
   * @returns {Object}
   */
  static error(statusCode, message, errors = null) {
    const response = {
      success: false,
      statusCode,
      message,
      data: null,
      error: message,
      timestamp: new Date().toISOString()
    };

    if (errors && errors.length > 0) {
      response.errors = errors;
    }

    return response;
  }

  /**
   * Create a paginated response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {Array} data - Response data array
   * @param {Object} pagination - Pagination metadata
   * @param {Object} extra - Extra data to include
   * @returns {Object}
   */
  static paginated(statusCode = httpStatusCodes.OK, message = 'Success', data = [], pagination = {}, extra = {}) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const total = pagination.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      statusCode,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      ...extra,
      error: null,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   */
  static sendSuccess(res, statusCode = httpStatusCodes.OK, message = 'Success', data = null) {
    return res.status(statusCode).json(this.success(statusCode, message, data));
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors
   */
  static sendError(res, statusCode, message, errors = null) {
    return res.status(statusCode).json(this.error(statusCode, message, errors));
  }

  /**
   * Send paginated response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {Array} data - Response data array
   * @param {Object} pagination - Pagination metadata
   * @param {Object} extra - Extra data to include
   */
  static sendPaginated(res, statusCode = httpStatusCodes.OK, message = 'Success', data = [], pagination = {}, extra = {}) {
    return res.status(statusCode).json(this.paginated(statusCode, message, data, pagination, extra));
  }
}

module.exports = ApiResponse;
