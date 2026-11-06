const { asyncHandler } = require('../utils/asyncHandler');
const fraudService = require('../services/fraudService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

const enrichPayload = (req) => ({
  ...req.body,
  ...req.query,
  ipAddress: req.body.ipAddress || req.ip,
  userId: req.user?._id || null
});

// @desc    Predict fraud for a transaction payload
// @route   POST /api/fraud/predict
// @access  Public
exports.predictFraud = asyncHandler(async (req, res) => {
  const result = await fraudService.predict(enrichPayload(req), {
    userId: req.user?._id || null
  });

  successResponse(res, 200, result, 'Fraud prediction completed');
});

// @desc    Analyze fraud signals for a transaction payload
// @route   POST /api/fraud/analyze
// @access  Public
exports.analyzeFraud = asyncHandler(async (req, res) => {
  const result = await fraudService.analyze(enrichPayload(req), {
    userId: req.user?._id || null
  });

  successResponse(res, 200, result, 'Fraud analysis completed');
});

// Backward compatibility for the transaction module
exports.analyzeTransaction = asyncHandler(async (req, res) => {
  const result = await fraudService.analyzeTransaction(enrichPayload(req));

  successResponse(res, 200, result, 'Fraud analysis completed');
});

// @desc    Get prediction history
// @route   GET /api/fraud/history
// @access  Private
exports.getPredictionHistory = asyncHandler(async (req, res) => {
  const result = await fraudService.getPredictionHistory(req.user, req.query);

  paginatedResponse(res, 200, result.predictions, result.pagination, 'Prediction history retrieved successfully');
});

// @desc    Get risk statistics
// @route   GET /api/fraud/statistics
// @access  Private (Admin only)
exports.getRiskStatistics = asyncHandler(async (req, res) => {
  const result = await fraudService.getRiskStatistics(req.query);

  successResponse(res, 200, result, 'Risk statistics retrieved successfully');
});

// @desc    Verify prediction
// @route   PUT /api/fraud/:predictionId/verify
// @access  Private (Admin only)
exports.verifyPrediction = asyncHandler(async (req, res) => {
  const { predictionId } = req.params;
  const { actualOutcome, notes } = req.body;

  const result = await fraudService.verifyPrediction(predictionId, req.user._id, {
    actualOutcome,
    notes
  });

  successResponse(res, 200, result, result.message);
});

// @desc    Get model status
// @route   GET /api/fraud/model-status
// @access  Public
exports.getModelStatus = asyncHandler(async (req, res) => {
  const result = await fraudService.getModelStatus();

  successResponse(res, 200, result, 'Model status retrieved successfully');
});

// @desc    Health check for fraud service
// @route   GET /api/fraud/health
// @access  Public
exports.getHealth = asyncHandler(async (req, res) => {
  const result = await fraudService.getHealth();

  successResponse(res, 200, result, 'Fraud service health retrieved successfully');
});
