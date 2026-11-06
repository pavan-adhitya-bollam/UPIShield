const asyncHandler = require('express-async-handler');
const adminService = require('../services/adminService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardStats();

  successResponse(res, 200, result, 'Dashboard statistics retrieved successfully');
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    kycStatus: req.query.kycStatus,
    isVerified: req.query.isVerified,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };

  const result = await adminService.getAllUsers(filters);

  paginatedResponse(res, 200, result.users, result.pagination, 'Users retrieved successfully');
});

// @desc    Get user details
// @route   GET /api/admin/users/:userId
// @access  Private (Admin only)
exports.getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await adminService.getUserDetails(userId);

  successResponse(res, 200, result, 'User details retrieved successfully');
});

// @desc    Update user status
// @route   PUT /api/admin/users/:userId/status
// @access  Private (Admin only)
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive, isSuspended, suspensionReason } = req.body;

  const result = await adminService.updateUserStatus(userId, {
    isActive,
    isSuspended,
    suspensionReason
  });

  successResponse(res, 200, result, result.message);
});

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private (Admin only)
exports.getAllTransactions = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status,
    riskLevel: req.query.riskLevel,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };

  const result = await adminService.getAllTransactions(filters);

  paginatedResponse(res, 200, result.transactions, result.pagination, 'Transactions retrieved successfully');
});

// @desc    Get model metrics
// @route   GET /api/admin/model-metrics
// @access  Private (Admin only)
exports.getModelMetrics = asyncHandler(async (req, res) => {
  const filters = {
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };

  const result = await adminService.getModelMetrics(filters);

  successResponse(res, 200, result, 'Model metrics retrieved successfully');
});

// @desc    Generate reports
// @route   GET /api/admin/reports/:reportType
// @access  Private (Admin only)
exports.generateReports = asyncHandler(async (req, res) => {
  const { reportType } = req.params;
  const filters = req.query;

  const result = await adminService.generateReports(reportType, filters);

  successResponse(res, 200, result, 'Report generated successfully');
});
