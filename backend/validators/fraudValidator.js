const { body, query } = require('express-validator');

const transactionPayloadValidation = [
  body('transactionId')
    .optional({ checkFalsy: true })
    .trim(),

  body('senderUpiId')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/).withMessage('Invalid sender UPI format'),

  body('receiverUpiId')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/).withMessage('Invalid receiver UPI format'),

  body('amount')
    .optional({ checkFalsy: true })
    .isNumeric().withMessage('Amount must be a number')
    .isFloat({ min: 0 }).withMessage('Amount must be greater than or equal to 0'),

  body('deviceId')
    .optional({ checkFalsy: true })
    .trim(),

  body('deviceType')
    .optional({ checkFalsy: true })
    .isIn(['Mobile', 'Desktop', 'Tablet']).withMessage('Invalid device type'),

  body('browser')
    .optional({ checkFalsy: true })
    .trim(),

  body('os')
    .optional({ checkFalsy: true })
    .trim(),

  body('ipAddress')
    .optional({ checkFalsy: true })
    .trim(),

  body('location')
    .optional({ checkFalsy: true })
    .trim(),

  body('merchantCategory')
    .optional({ checkFalsy: true })
    .trim(),

  body('purpose')
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('riskLevel')
    .optional({ checkFalsy: true })
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Invalid risk level'),

  query('search')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Search query is too long'),

  query('startDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid start date format'),

  query('endDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid end date format')
];

// Risk statistics validation
exports.getRiskStatisticsValidation = [
  query('startDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid start date format'),

  query('endDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid end date format')
];

exports.modelStatusValidation = [];
