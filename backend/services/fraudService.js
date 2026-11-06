const FraudPrediction = require('../models/FraudPrediction');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { parsePagination, generatePredictionId } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');
const predictionProvider = require('./PredictionProvider');

const MIN_BEHAVIORAL_HISTORY = Math.max(
  1,
  Number.parseInt(process.env.MIN_BEHAVIORAL_HISTORY || '3', 10)
);
const INSUFFICIENT_HISTORY_MESSAGE =
  'New Account – No Previous Transaction History. Behavioural Risk Assessment Not Available.';

const getPreviousTransactions = async (userId, transactionId) => Transaction.find({
  'sender.userId': userId,
  ...(transactionId ? { transactionId: { $ne: transactionId } } : {})
})
  .sort({ transactionTime: -1 })
  .lean();

const insufficientHistoryAssessment = () => ({
  riskScore: 0,
  fraudProbability: null,
  riskLevel: 'NO_HISTORY',
  confidence: 0,
  predictionStatus: 'SKIPPED',
  assessmentStatus: 'INSUFFICIENT_TRANSACTION_HISTORY',
  provider: 'NONE',
  assessmentMessage: INSUFFICIENT_HISTORY_MESSAGE,
  reasons: [],
  predictionId: null,
  isFraud: false
});

const normalizeRole = (role) => String(role || '').toUpperCase();

const buildPredictionRecord = (payload, prediction, providerName) => ({
  transactionId: payload.transactionId,
  predictionId: prediction.predictionId || generatePredictionId(),
  userId: payload.userId || null,
  modelInfo: {
    modelName: prediction.modelName || 'Behavioral Fraud Risk Engine',
    modelVersion: prediction.modelVersion || 'behavioral-v2.0',
    predictionThreshold: prediction.threshold ?? 0.6
  },
  prediction: {
    riskScore: prediction.riskScore,
    fraudProbability: prediction.fraudProbability,
    riskLevel: prediction.riskLevel,
    confidence: prediction.predictionConfidence,
    isFraud: prediction.isFraud
  },
  features: {
    customerBehaviourDeviation: prediction.behaviourAnalysis?.customerBehaviourDeviation ? 1 : 0,
    deviceChanged: prediction.deviceAnalysis?.deviceChanged || false,
    newBeneficiary: prediction.beneficiaryAnalysis?.newBeneficiary || false,
    locationChanged: prediction.locationAnalysis?.locationChanged || false,
    highVelocity: prediction.velocityAnalysis?.highTransactionVelocity || false,
    transactionFrequency: prediction.velocityAnalysis?.highTransactionVelocity ? 5 : 1,
    merchantCategory: payload.merchantCategory || 'Transfer',
    amountLast24Hours: payload.amount || 0,
    transactionAmount: payload.amount || 0,
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    isBusinessHour: new Date().getHours() >= 9 && new Date().getHours() < 18,
    deviceType: payload.deviceType || 'Mobile',
    browser: payload.browser || 'Unknown',
    os: payload.os || 'Unknown',
    location: payload.location?.city || 'Unknown'
  },
  shapValues: {
    baseValue: 0.5,
    positiveContributors: prediction.featureContributions?.map((item) => ({
      feature: item.feature,
      contribution: item.contribution
    })) || [],
    negativeContributors: []
  },
  featureImportance: prediction.featureContributions?.map((item, index) => ({
    feature: item.feature,
    importance: item.contribution,
    rank: index + 1
  })) || [],
  reasons: (prediction.fraudReasons || []).map((reason) => ({
    feature: reason,
    impact: 0.1,
    description: reason
  })),
  actionTaken: prediction.riskLevel === 'CRITICAL' ? 'Blocked' : prediction.riskLevel === 'HIGH' ? 'Flagged' : 'Approved',
  predictionTime: prediction.predictionTime || new Date(),
  processingTime: prediction.processingTime || 12,
  provider: providerName
});

const persistPrediction = async (payload, prediction, providerName) => {
  const predictionId = prediction.predictionId || generatePredictionId();
  const record = buildPredictionRecord({ ...payload, predictionId }, { ...prediction, predictionId }, providerName);
  const existing = await FraudPrediction.findOne({ transactionId: payload.transactionId });

  if (existing) {
    existing.set(record);
    await existing.save();
    return existing;
  }

  return FraudPrediction.create(record);
};

const syncTransactionWithPrediction = async (transactionId, prediction) => {
  const transaction = await Transaction.findOne({ transactionId });
  if (!transaction) {
    return null;
  }

  transaction.fraudAnalysis = {
    riskScore: prediction.riskScore,
    fraudProbability: prediction.fraudProbability,
    riskLevel: prediction.riskLevel,
    confidence: prediction.predictionConfidence,
    features: {
      customerBehaviourDeviation: prediction.behaviourAnalysis?.customerBehaviourDeviation ? 1 : 0,
      deviceChanged: prediction.deviceAnalysis?.deviceChanged || false,
      newBeneficiary: prediction.beneficiaryAnalysis?.newBeneficiary || false,
      locationChanged: prediction.locationAnalysis?.locationChanged || false,
      highVelocity: prediction.velocityAnalysis?.highTransactionVelocity || false,
      transactionFrequency: prediction.velocityAnalysis?.highTransactionVelocity ? 5 : 1,
      amountLast24Hours: transaction.amount
    },
    reasons: (prediction.fraudReasons || []).map((reason) => ({
      feature: reason,
      impact: 0.1,
      description: reason
    })),
    modelVersion: prediction.modelVersion,
    analysisTimestamp: prediction.predictionTime
  };

  transaction.riskScore = prediction.riskScore;
  transaction.fraudProbability = prediction.fraudProbability;
  transaction.riskLevel = prediction.riskLevel;
  transaction.predictionStatus = prediction.predictionStatus;
  transaction.predictionConfidence = prediction.predictionConfidence;
  transaction.fraudReasons = (prediction.fraudReasons || []).map((reason) => ({
    feature: reason,
    impact: 0.1,
    description: reason
  }));
  transaction.deviceInfo = {
    deviceId: transaction.deviceInfo?.deviceId || null,
    deviceName: transaction.deviceInfo?.deviceName || 'Unknown',
    deviceType: transaction.deviceInfo?.deviceType || 'Mobile',
    browser: transaction.deviceInfo?.browser || 'Unknown',
    os: transaction.deviceInfo?.os || 'Unknown',
    isTrusted: transaction.deviceInfo?.isTrusted || false
  };
  transaction.locationInfo = transaction.locationInfo || null;
  transaction.ipAddress = transaction.ipAddress || null;

  if (prediction.riskLevel === 'CRITICAL') {
    transaction.status = 'BLOCKED';
  } else if (prediction.riskLevel === 'HIGH') {
    transaction.status = 'BLOCKED';
  } else if (prediction.riskLevel === 'MEDIUM') {
    transaction.status = 'PROCESSING';
  } else {
    transaction.status = 'SUCCESS';
    transaction.completedAt = new Date();
  }

  await transaction.save();
  return transaction;
};

const buildPredictionResponse = (predictionRecord, prediction) => ({
  predictionId: predictionRecord.predictionId,
  transactionId: predictionRecord.transactionId,
  riskScore: prediction.riskScore,
  fraudProbability: prediction.fraudProbability,
  riskLevel: prediction.riskLevel,
  predictionStatus: prediction.predictionStatus,
  predictionConfidence: prediction.predictionConfidence,
  fraudReasons: prediction.fraudReasons,
  recommendations: prediction.recommendations,
  predictionTime: prediction.predictionTime,
  modelVersion: prediction.modelVersion,
  modelName: prediction.modelName,
  threshold: prediction.threshold,
  provider: prediction.provider,
  isFraud: prediction.isFraud
});

const predict = async (payload = {}, options = {}) => {
  const prediction = await predictionProvider.predict(payload);
  const record = await persistPrediction({ ...payload, userId: options.userId || null }, prediction, 'predict');
  if (payload.transactionId) {
    await syncTransactionWithPrediction(payload.transactionId, prediction);
  }

  return buildPredictionResponse(record, prediction);
};

const analyze = async (payload = {}, options = {}) => {
  const prediction = await predictionProvider.analyze(payload);
  const record = await persistPrediction({ ...payload, userId: options.userId || null }, prediction, 'analyze');
  if (payload.transactionId) {
    await syncTransactionWithPrediction(payload.transactionId, prediction);
  }

  return {
    ...buildPredictionResponse(record, prediction),
    featureContributions: prediction.featureContributions,
    deviceAnalysis: prediction.deviceAnalysis,
    locationAnalysis: prediction.locationAnalysis,
    behaviourAnalysis: prediction.behaviourAnalysis,
    velocityAnalysis: prediction.velocityAnalysis,
    beneficiaryAnalysis: prediction.beneficiaryAnalysis
  };
};

const analyzeTransaction = async (transactionData) => {
  const previousTransactions = await getPreviousTransactions(
    transactionData.userId,
    transactionData.transactionId
  );

  if (previousTransactions.length < MIN_BEHAVIORAL_HISTORY) {
    return insufficientHistoryAssessment();
  }

  const enrichedTransactionData = buildBehavioralFeatures(transactionData, previousTransactions);
  const prediction = await predict(enrichedTransactionData, {
    userId: transactionData.userId || null
  });

  return {
    riskScore: prediction.riskScore,
    fraudProbability: prediction.fraudProbability,
    riskLevel: prediction.riskLevel,
    confidence: prediction.predictionConfidence,
    reasons: prediction.fraudReasons,
    predictionId: prediction.predictionId,
    assessmentStatus: 'COMPLETED',
    provider: prediction.provider,
    assessmentMessage: null,
    isFraud: prediction.isFraud
  };
};

const buildBehavioralFeatures = (transactionData, previousTransactions) => {
  const now = new Date();
  const transactionAmount = Number(transactionData.amount || 0);
  const inWindow = (milliseconds) => previousTransactions.filter((transaction) => (
    now - new Date(transaction.transactionTime || transaction.createdAt) <= milliseconds
  ));
  const lastHour = inWindow(60 * 60 * 1000);
  const lastDay = inWindow(24 * 60 * 60 * 1000);
  const receiversToday = new Set(
    previousTransactions
      .filter((transaction) => new Date(transaction.transactionTime || transaction.createdAt).toDateString() === now.toDateString())
      .map((transaction) => transaction.receiverUpi)
      .filter(Boolean)
  );
  const historicalAmounts = previousTransactions.map((transaction) => Number(transaction.amount || 0));
  const averageAmount = historicalAmounts.reduce((sum, amount) => sum + amount, 0) / historicalAmounts.length;
  const deviation = averageAmount > 0 ? Math.min(transactionAmount / averageAmount, 10) : 0;

  return {
    ...transactionData,
    transactionsLast10Minutes: inWindow(10 * 60 * 1000).length,
    transactionsLastHour: lastHour.length,
    transactionsLast24Hours: lastDay.length,
    amountSentLast24Hours: lastDay.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
    uniqueReceiversToday: receiversToday.size,
    customerBehaviourDeviation: deviation,
    knownDevice: previousTransactions.some((transaction) => transaction.deviceInfo?.deviceId === transactionData.deviceId),
    locationChanged: previousTransactions.length > 0 &&
      previousTransactions[0].locationInfo?.city !== transactionData.location?.city,
    newBeneficiary: !previousTransactions.some((transaction) => transaction.receiverUpi === transactionData.receiverUpi)
  };
};

const assessTransaction = async (transactionData = {}) => {
  const previousTransactions = await getPreviousTransactions(transactionData.userId);
  if (previousTransactions.length < MIN_BEHAVIORAL_HISTORY) {
    return insufficientHistoryAssessment();
  }

  const prediction = await predictionProvider.predict(
    buildBehavioralFeatures(transactionData, previousTransactions)
  );

  return {
    riskScore: prediction.riskScore,
    fraudProbability: prediction.fraudProbability,
    riskLevel: prediction.riskLevel,
    confidence: prediction.predictionConfidence,
    predictionStatus: prediction.predictionStatus,
    predictionConfidence: prediction.predictionConfidence,
    fraudReasons: prediction.fraudReasons,
    predictionTime: prediction.predictionTime,
    modelVersion: prediction.modelVersion,
    provider: prediction.provider,
    assessmentStatus: 'COMPLETED',
    assessmentMessage: null,
    isFraud: prediction.isFraud
  };
};

const buildPredictionQuery = (user, filters = {}) => {
  const normalizedRole = normalizeRole(user.role);
  const query = normalizedRole === 'ADMIN' ? {} : { userId: user._id };

  if (filters.search) {
    query.$or = [
      { transactionId: { $regex: filters.search, $options: 'i' } },
      { predictionId: { $regex: filters.search, $options: 'i' } },
      { 'prediction.riskLevel': { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.riskLevel) {
    query['prediction.riskLevel'] = filters.riskLevel;
  }

  if (filters.startDate || filters.endDate) {
    query.predictionTime = {};
    if (filters.startDate) query.predictionTime.$gte = new Date(filters.startDate);
    if (filters.endDate) query.predictionTime.$lte = new Date(filters.endDate);
  }

  return query;
};

const getPredictionHistory = async (user, filters = {}) => {
  const { page, limit, skip } = parsePagination(filters);
  const query = buildPredictionQuery(user, filters);

  const predictions = await FraudPrediction.find(query)
    .sort({ predictionTime: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await FraudPrediction.countDocuments(query);

  return {
    predictions,
    pagination: {
      page,
      limit,
      total
    }
  };
};

const getRiskStatistics = async (filters = {}) => {
  const query = {};

  if (filters.startDate || filters.endDate) {
    query.predictionTime = {};
    if (filters.startDate) query.predictionTime.$gte = new Date(filters.startDate);
    if (filters.endDate) query.predictionTime.$lte = new Date(filters.endDate);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayQuery = { ...query, predictionTime: { ...(query.predictionTime || {}), $gte: today } };

  const todaysPredictions = await FraudPrediction.countDocuments(todayQuery);
  const todaysFraud = await FraudPrediction.countDocuments({ ...todayQuery, 'prediction.isFraud': true });
  const todaysGenuine = todaysPredictions - todaysFraud;

  const aggregates = await FraudPrediction.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        averageRisk: { $avg: '$prediction.riskScore' },
        averageConfidence: { $avg: '$prediction.confidence' },
        total: { $sum: 1 }
      }
    }
  ]);

  const predictionDistribution = await FraudPrediction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$prediction.isFraud',
        count: { $sum: 1 }
      }
    }
  ]);

  const riskDistribution = await FraudPrediction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$prediction.riskLevel',
        count: { $sum: 1 }
      }
    }
  ]);

  const riskDistributionMap = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0
  };

  riskDistribution.forEach((item) => {
    riskDistributionMap[item._id] = item.count;
  });

  return {
    todaysPredictions,
    todaysFraud,
    todaysGenuine,
    averageRisk: Number((aggregates[0]?.averageRisk || 0).toFixed(2)),
    averageConfidence: Number((aggregates[0]?.averageConfidence || 0).toFixed(2)),
    predictionDistribution: {
      fraudulent: predictionDistribution.find((item) => item._id === true)?.count || 0,
      genuine: predictionDistribution.find((item) => item._id === false)?.count || 0
    },
    riskDistribution: riskDistributionMap
  };
};

const getModelStatus = async () => predictionProvider.modelStatus();

const getHealth = async () => {
  const dbConnected = require('mongoose').connection.readyState === 1;
  const modelStatus = await getModelStatus();
  const providerHealth = await predictionProvider.health();

  return {
    backendStatus: 'healthy',
    fraudServiceStatus: 'healthy',
    databaseStatus: dbConnected ? 'connected' : 'disconnected',
    modelStatus: modelStatus.status || 'Healthy',
    healthy: dbConnected && providerHealth.healthy !== false,
    provider: providerHealth.provider || 'fastapi'
  };
};

const verifyPrediction = async (predictionId, userId, verificationData) => {
  const prediction = await FraudPrediction.findOne({ predictionId });

  if (!prediction) {
    throw new ErrorResponse('Prediction not found', 404);
  }

  prediction.verification = {
    isVerified: true,
    verifiedBy: userId,
    verifiedAt: new Date(),
    actualOutcome: verificationData.actualOutcome,
    verificationNotes: verificationData.notes
  };

  await prediction.save();

  return {
    message: 'Prediction verified successfully',
    prediction
  };
};

module.exports = {
  predict,
  analyze,
  analyzeTransaction,
  assessTransaction,
  getPredictionHistory,
  getRiskStatistics,
  getModelStatus,
  getHealth,
  getFeatureImportance: async () => [],
  verifyPrediction
};
