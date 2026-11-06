const { asyncHandler } = require('../utils/asyncHandler');
const transactionService = require('../services/transactionService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

// @desc    Send money
// @route   POST /api/transactions/send
// @access  Private
exports.sendMoney = asyncHandler(async (req, res) => {
  const result = await transactionService.sendMoney(req.user, req.body, req.headers, req.ip);

  successResponse(res, 201, result, 'Transaction initiated successfully');
});

// @desc    Assess transaction risk without creating a transaction
// @route   POST /api/transactions/assess
// @access  Private
exports.assessTransaction = asyncHandler(async (req, res) => {
  const result = await transactionService.assessTransaction(req.user, req.body, req.headers, req.ip);

  successResponse(res, 200, result, 'Risk assessment completed');
});

// @desc    Create the authenticated user's MPIN
// @route   POST /api/transactions/create-mpin
// @access  Private
exports.createMpin = asyncHandler(async (req, res) => {
  const result = await transactionService.createMpin(req.user, req.body.mpin);

  successResponse(res, 201, result, 'MPIN created successfully');
});

// @desc    Authorize payment with the MPIN before transaction creation
// @route   POST /api/transactions/verify-mpin
// @access  Private
exports.verifyMpin = asyncHandler(async (req, res) => {
  const result = await transactionService.authorizeMpin(req.user, req.body.mpin);

  successResponse(res, 200, result, 'MPIN verified successfully');
});

// @desc    Get transaction history
// @route   GET /api/transactions/history
// @access  Private
exports.getTransactionHistory = asyncHandler(async (req, res) => {
  const result = await transactionService.getTransactionHistory(req.user, req.query);

  paginatedResponse(res, 200, result.transactions, result.pagination, 'Transactions retrieved successfully');
});

// @desc    Get transaction details
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await transactionService.getTransactionDetails(id, req.user);

  successResponse(res, 200, transaction, 'Transaction details retrieved successfully');
});

// @desc    Download receipt
// @route   GET /api/transactions/:id/receipt
// @access  Private
exports.downloadReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await transactionService.downloadReceipt(id, req.user);

  successResponse(res, 200, result, 'Receipt generated successfully');
});

// @desc    Export CSV
// @route   GET /api/transactions/export/csv
// @access  Private
exports.exportCsv = asyncHandler(async (req, res) => {
  const result = await transactionService.exportCsv(req.user, req.query);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
  res.send(result.csvContent);
});

// @desc    Cancel transaction
// @route   PUT /api/transactions/:id/cancel
// @access  Private
exports.cancelTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await transactionService.cancelTransaction(id, req.user);

  successResponse(res, 200, result, result.message);
});
