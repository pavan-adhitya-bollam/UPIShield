const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/ApiResponse');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    console.log('Validation errors:', JSON.stringify(errorDetails, null, 2));
    return res.status(400).json(ApiResponse.error(400, 'Validation failed', errorDetails));
  }
  next();
};

module.exports = validate;
