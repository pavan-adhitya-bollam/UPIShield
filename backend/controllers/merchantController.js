const asyncHandler = require('express-async-handler');
const merchantService = require('../services/merchantService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

// @desc    Get merchant dashboard
// @route   GET /api/merchant/dashboard
// @access  Private (Merchant only)
exports.getMerchantDashboard = asyncHandler(async (req, res) => {
  const result = await merchantService.getMerchantDashboard(req.user._id);

  successResponse(res, 200, result, 'Merchant dashboard retrieved successfully');
});

// @desc    Get merchant transactions
// @route   GET /api/merchant/transactions
// @access  Private (Merchant only)
exports.getMerchantTransactions = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };

  const result = await merchantService.getMerchantTransactions(req.user._id, filters);

  paginatedResponse(res, 200, result.transactions, result.pagination, 'Merchant transactions retrieved successfully');
});

// @desc    Get merchant analytics
// @route   GET /api/merchant/analytics
// @access  Private (Merchant only)
exports.getMerchantAnalytics = asyncHandler(async (req, res) => {
  const filters = {
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };

  const result = await merchantService.getMerchantAnalytics(req.user._id, filters);

  successResponse(res, 200, result, 'Merchant analytics retrieved successfully');
});
