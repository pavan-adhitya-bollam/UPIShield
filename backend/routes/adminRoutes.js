const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', protect, authorize('admin'), adminController.getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', protect, authorize('admin'), adminController.getAllUsers);

// @route   GET /api/admin/users/:userId
// @desc    Get user details
// @access  Private (Admin only)
router.get('/users/:userId', protect, authorize('admin'), adminController.getUserDetails);

// @route   PUT /api/admin/users/:userId/status
// @desc    Update user status
// @access  Private (Admin only)
router.put('/users/:userId/status', protect, authorize('admin'), adminController.updateUserStatus);

// @route   GET /api/admin/transactions
// @desc    Get all transactions
// @access  Private (Admin only)
router.get('/transactions', protect, authorize('admin'), adminController.getAllTransactions);

// @route   GET /api/admin/model-metrics
// @desc    Get model metrics
// @access  Private (Admin only)
router.get('/model-metrics', protect, authorize('admin'), adminController.getModelMetrics);

// @route   GET /api/admin/reports/:reportType
// @desc    Generate reports
// @access  Private (Admin only)
router.get('/reports/:reportType', protect, authorize('admin'), adminController.generateReports);

module.exports = router;
