const express = require('express');
const router = express.Router();
const fraudController = require('../controllers/fraudController');
const { protect, authorize } = require('../middlewares/auth');
const { fraudRateLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validation');
const {
  analyzeTransactionValidation,
  getPredictionHistoryValidation,
  getRiskStatisticsValidation,
  predictValidation,
  analyzeValidation,
  modelStatusValidation
} = require('../validators/fraudValidator');

// @route   POST /api/fraud/predict
// @desc    Predict fraud for a transaction payload
// @access  Public
router.post('/predict', fraudRateLimiter, predictValidation, validate, fraudController.predictFraud);

// @route   POST /api/fraud/analyze
// @desc    Analyze a transaction payload
// @access  Public
router.post('/analyze', fraudRateLimiter, analyzeValidation, validate, fraudController.analyzeFraud);

// @route   GET /api/fraud/history
// @desc    Get prediction history
// @access  Private
router.get('/history', protect, getPredictionHistoryValidation, validate, fraudController.getPredictionHistory);

// @route   GET /api/fraud/statistics
// @desc    Get risk statistics
// @access  Private (Admin only)
router.get('/statistics', protect, authorize('ADMIN'), getRiskStatisticsValidation, validate, fraudController.getRiskStatistics);

// @route   GET /api/fraud/model-status
// @desc    Get model status
// @access  Public
router.get('/model-status', modelStatusValidation, validate, fraudController.getModelStatus);

// @route   GET /api/fraud/health
// @desc    Get fraud service health
// @access  Public
router.get('/health', fraudController.getHealth);

// Backward compatibility
router.post('/predict-legacy', fraudRateLimiter, analyzeTransactionValidation, validate, fraudController.analyzeTransaction);

// @route   PUT /api/fraud/:predictionId/verify
// @desc    Verify prediction
// @access  Private (Admin only)
router.put('/:predictionId/verify', protect, authorize('ADMIN'), fraudController.verifyPrediction);

module.exports = router;
