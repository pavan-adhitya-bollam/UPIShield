const ApiError = require('./ApiError');

class ErrorResponse extends ApiError {
  constructor(message, statusCode = 400, errors = []) {
    super(statusCode, message, errors);
  }
}

module.exports = ErrorResponse;
