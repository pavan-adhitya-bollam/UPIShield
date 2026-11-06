const ApiResponse = require('./ApiResponse');

const successResponse = (res, statusCode, data, message = 'Success') => {
  return ApiResponse.sendSuccess(res, statusCode, message, data);
};

const errorResponse = (res, statusCode, message = 'Error', errors = null) => {
  return ApiResponse.sendError(res, statusCode, message, errors);
};

const paginatedResponse = (res, statusCode, data, pagination, message = 'Success', extra = {}) => {
  return ApiResponse.sendPaginated(res, statusCode, message, data, pagination, extra);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
