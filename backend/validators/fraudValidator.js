const { body, query } = require('express-validator');

const transactionPayloadValidation = [
  body('transactionId')
    .optional()
    .trim(),

  body('senderUpiId')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/).withMessage('Invalid sender UPI format'),

  body('receiverUpiId')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/).withMessage('Invalid receiver UPI format'),

  body('amount')
    .optional()
    .isNumeric().withMessage('Amount must be a number')
    .isFloat({ min: 0 }).withMessage('Amount must be greater than or equal to 0'),

  body('deviceId')
    .optional()
    .trim(),

  body('deviceType')
    .optional()
    .isIn(['Mobile', 'Desktop', 'Tablet']).withMessage('Invalid device type'),

  body('browser')
    .optional()
    .trim(),

  body('os')
    .optional()
    .trim(),

  body('ipAddress')
    .optional()
    .trim(),

  body('location')
    .optional()
    .trim(),

  body('merchantCategory')
    .optional()
    .trim(),

  body('purpose')
    .optional()
    .trim()
];

exports.analyzeTransactionValidation = transactionPayloadValidation;
exports.predictValidation = [
  ...transactionPayloadValidation,
  body('transactionId')
    .notEmpty().withMessage('Transaction ID is required')
];

exports.analyzeValidation = [
  ...transactionPayloadValidation,
  body('amount')
    .notEmpty().withMessage('Amount is required')
];

// Get prediction history validation
exports.getPredictionHistoryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('riskLevel')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Invalid risk level'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query is too long'),

  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),

  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format')
];

// Risk statistics validation
exports.getRiskStatisticsValidation = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),

  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format')
];

exports.modelStatusValidation = [];
