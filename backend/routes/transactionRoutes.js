const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const {
  sendMoneyValidation,
  createMpinValidation,
  verifyMpinValidation,
  getTransactionHistoryValidation,
  getTransactionDetailsValidation,
  exportCsvValidation,
  receiptValidation,
  cancelTransactionValidation
} = require('../validators/transactionValidator');

// @route   POST /api/transactions/send
// @desc    Send money
// @access  Private
router.post('/send', protect, sendMoneyValidation, validate, transactionController.sendMoney);

// @route   POST /api/transactions/assess
// @desc    Assess transaction risk without creating a transaction
// @access  Private
router.post('/assess', protect, sendMoneyValidation, validate, transactionController.assessTransaction);

// @route   POST /api/transactions/create-mpin
// @desc    Create the authenticated user's MPIN
// @access  Private
router.post('/create-mpin', protect, createMpinValidation, validate, transactionController.createMpin);

// @route   POST /api/transactions/verify-mpin
// @desc    Verify MPIN before creating a transaction
// @access  Private
router.post('/verify-mpin', protect, verifyMpinValidation, validate, transactionController.verifyMpin);

// @route   GET /api/transactions/history
// @desc    Get transaction history
// @access  Private
router.get('/history', protect, getTransactionHistoryValidation, validate, transactionController.getTransactionHistory);

// Backward compatibility
router.get('/', protect, getTransactionHistoryValidation, validate, transactionController.getTransactionHistory);

// @route   GET /api/transactions/export/csv
// @desc    Export transactions as CSV
// @access  Private
router.get('/export/csv', protect, exportCsvValidation, validate, transactionController.exportCsv);

// Backward compatibility
router.get('/export', protect, exportCsvValidation, validate, transactionController.exportCsv);

// @route   GET /api/transactions/:id
// @desc    Get transaction details
// @access  Private
router.get('/:id', protect, getTransactionDetailsValidation, validate, transactionController.getTransactionDetails);

// @route   GET /api/transactions/:id/receipt
// @desc    Download transaction receipt
// @access  Private
router.get('/:id/receipt', protect, receiptValidation, validate, transactionController.downloadReceipt);

// @route   PUT /api/transactions/:id/cancel
// @desc    Cancel transaction
// @access  Private
router.put('/:id/cancel', protect, cancelTransactionValidation, validate, transactionController.cancelTransaction);

module.exports = router;
