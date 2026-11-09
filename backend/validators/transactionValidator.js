const { body, param, query } = require('express-validator');

const transactionStatuses = ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'BLOCKED'];
const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const transactionTypes = ['P2P', 'P2M', 'SELF', 'BILL', 'RECHARGE', 'TRANSFER'];

// Send money validation
exports.sendMoneyValidation = [
  body('receiverUpi')
    .trim()
    .notEmpty().withMessage('Receiver UPI is required')
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/).withMessage('Invalid UPI ID format'),

  body('senderUpi')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/).withMessage('Invalid sender UPI format'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number')
    .isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
    .isFloat({ max: 1000000 }).withMessage('Amount cannot exceed 1,000,000'),

  body('purpose')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Purpose cannot exceed 200 characters'),

  body('merchantCategory')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Merchant category cannot exceed 100 characters'),

  body('note')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 250 }).withMessage('Note cannot exceed 250 characters'),

  body('transactionType')
    .optional({ checkFalsy: true })
    .isIn(transactionTypes).withMessage('Invalid transaction type'),

  body('paymentMethod')
    .optional({ checkFalsy: true })
    .isIn(['UPI', 'PHONEPE', 'GOOGLE_PAY', 'PAYTM', 'BHIM']).withMessage('Invalid payment method')
];

const mpinValidation = [
  body('mpin')
    .notEmpty().withMessage('Please enter your 6-digit MPIN')
    .isNumeric().withMessage('MPIN must contain only digits')
    .isLength({ min: 6, max: 6 }).withMessage('MPIN must be 6 digits')
];

exports.createMpinValidation = mpinValidation;
exports.verifyMpinValidation = mpinValidation;

// Transaction history validation
exports.getTransactionHistoryValidation = [
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Search query is too long'),

  query('sortBy')
    .optional({ checkFalsy: true })
    .isIn(['transactionTime', 'amount', 'status', 'riskScore', 'createdAt']).withMessage('Invalid sort field'),

  query('sortOrder')
    .optional({ checkFalsy: true })
    .isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),

  query('status')
    .optional({ checkFalsy: true })
    .isIn(transactionStatuses).withMessage('Invalid status'),

  query('riskLevel')
    .optional({ checkFalsy: true })
    .isIn(riskLevels).withMessage('Invalid risk level'),

  query('transactionType')
    .optional({ checkFalsy: true })
    .isIn(transactionTypes).withMessage('Invalid transaction type'),

  query('merchantCategory')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Merchant category cannot exceed 100 characters'),

  query('startDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid start date format'),

  query('endDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid end date format'),

  query('minAmount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Minimum amount must be a valid number'),

  query('maxAmount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Maximum amount must be a valid number')
];

// Transaction details validation
exports.getTransactionDetailsValidation = [
  param('id')
    .notEmpty().withMessage('Transaction ID is required')
    .isLength({ min: 8, max: 64 }).withMessage('Invalid transaction ID')
];

// Receipt validation
exports.receiptValidation = [
  param('id')
    .notEmpty().withMessage('Transaction ID is required')
    .isLength({ min: 8, max: 64 }).withMessage('Invalid transaction ID')
];

// Cancel validation
exports.cancelTransactionValidation = [
  param('id')
    .notEmpty().withMessage('Transaction ID is required')
    .isLength({ min: 8, max: 64 }).withMessage('Invalid transaction ID')
];

// Export CSV validation
exports.exportCsvValidation = [
  query('search')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Search query is too long'),

  query('status')
    .optional({ checkFalsy: true })
    .isIn(transactionStatuses).withMessage('Invalid status'),

  query('riskLevel')
    .optional({ checkFalsy: true })
    .isIn(riskLevels).withMessage('Invalid risk level'),

  query('transactionType')
    .optional({ checkFalsy: true })
    .isIn(transactionTypes).withMessage('Invalid transaction type'),

  query('merchantCategory')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Merchant category cannot exceed 100 characters'),

  query('startDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid start date format'),

  query('endDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid end date format'),

  query('minAmount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Minimum amount must be a valid number'),

  query('maxAmount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Maximum amount must be a valid number')
];
