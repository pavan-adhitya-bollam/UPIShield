const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { protect, authorize } = require('../middlewares/auth');

// @route   GET /api/merchant/dashboard
// @desc    Get merchant dashboard
// @access  Private (Merchant only)
router.get('/dashboard', protect, authorize('merchant'), merchantController.getMerchantDashboard);

// @route   GET /api/merchant/transactions
// @desc    Get merchant transactions
// @access  Private (Merchant only)
router.get('/transactions', protect, authorize('merchant'), merchantController.getMerchantTransactions);

// @route   GET /api/merchant/analytics
// @desc    Get merchant analytics
// @access  Private (Merchant only)
router.get('/analytics', protect, authorize('merchant'), merchantController.getMerchantAnalytics);

module.exports = router;
