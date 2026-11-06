const User = require('../models/User');
const Transaction = require('../models/Transaction');
const FraudPrediction = require('../models/FraudPrediction');
const { parsePagination, parseSort } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');

// Get dashboard statistics
const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments({ role: 'USER' });
  const totalMerchants = await User.countDocuments({ role: 'MERCHANT' });
  const totalTransactions = await Transaction.countDocuments();
  const totalFraudPredictions = await FraudPrediction.countDocuments();
  const fraudDetected = await FraudPrediction.countDocuments({ 'prediction.isFraud': true });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTransactions = await Transaction.countDocuments({ 'timing.date': { $gte: today } });
  const todayFraud = await FraudPrediction.countDocuments({
    'prediction.isFraud': true,
    predictionTime: { $gte: today }
  });

  return {
    totalUsers,
    totalMerchants,
    totalTransactions,
    totalFraudPredictions,
    fraudDetected,
    fraudRate: totalFraudPredictions > 0 ? (fraudDetected / totalFraudPredictions * 100).toFixed(2) : 0,
    todayTransactions,
    todayFraud
  };
};

// Get all users
const getAllUsers = async (filters = {}) => {
  const { page, limit, skip } = parsePagination(filters);
  const sort = parseSort(filters);

  const query = { role: 'USER' };

  if (filters.search) {
    query.$or = [
      { fullName: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
      { phone: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.kycStatus) {
    query.kycStatus = filters.kycStatus;
  }

  if (filters.isVerified !== undefined) {
    query.isVerified = filters.isVerified;
  }

  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      page,
      limit,
      total
    }
  };
};

// Get user details
const getUserDetails = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  // Get user's transactions
  const transactions = await Transaction.find({ 'sender.userId': userId })
    .sort({ 'timing.date': -1 })
    .limit(10);

  // Get user's fraud predictions
  const predictions = await FraudPrediction.find({ userId })
    .sort({ predictionTime: -1 })
    .limit(10);

  return {
    user,
    transactions,
    predictions
  };
};

// Update user status
const updateUserStatus = async (userId, statusData) => {
  const { isActive, isSuspended, suspensionReason } = statusData;

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  if (isActive !== undefined) {
    user.isActive = isActive;
  }

  if (isSuspended !== undefined) {
    user.isSuspended = isSuspended;
    user.suspensionReason = suspensionReason;
  }

  await user.save();

  return {
    message: 'User status updated successfully',
    user
  };
};

// Get all transactions
const getAllTransactions = async (filters = {}) => {
  const { page, limit, skip } = parsePagination(filters);
  const sort = parseSort(filters);

  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.riskLevel) {
    query['fraudAnalysis.riskLevel'] = filters.riskLevel;
  }

  if (filters.startDate || filters.endDate) {
    query['timing.date'] = {};
    if (filters.startDate) {
      query['timing.date'].$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query['timing.date'].$lte = new Date(filters.endDate);
    }
  }

  const transactions = await Transaction.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total
    }
  };
};

// Get model metrics
const getModelMetrics = async (filters = {}) => {
  const query = {};

  if (filters.startDate || filters.endDate) {
    query.predictionTime = {};
    if (filters.startDate) {
      query.predictionTime.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.predictionTime.$lte = new Date(filters.endDate);
    }
  }

  const totalPredictions = await FraudPrediction.countDocuments(query);
  const fraudPredictions = await FraudPrediction.countDocuments({ ...query, 'prediction.isFraud': true });
  const genuinePredictions = totalPredictions - fraudPredictions;

  // Calculate average confidence
  const avgConfidenceResult = await FraudPrediction.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        avgConfidence: { $avg: '$prediction.confidence' }
      }
    }
  ]);

  const avgConfidence = avgConfidenceResult[0]?.avgConfidence || 0;

  // Risk level distribution
  const riskLevelStats = await FraudPrediction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$prediction.riskLevel',
        count: { $sum: 1 }
      }
    }
  ]);

  const riskLevelCounts = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0
  };

  riskLevelStats.forEach(stat => {
    riskLevelCounts[stat._id] = stat.count;
  });

  return {
    totalPredictions,
    fraudPredictions,
    genuinePredictions,
    fraudRate: totalPredictions > 0 ? (fraudPredictions / totalPredictions * 100).toFixed(2) : 0,
    avgConfidence: avgConfidence.toFixed(2),
    riskLevelCounts
  };
};

// Generate reports
const generateReports = async (reportType, filters = {}) => {
  let data;

  switch (reportType) {
    case 'transactions':
      data = await Transaction.find(filters).sort({ 'timing.date': -1 });
      break;
    case 'fraud':
      data = await FraudPrediction.find(filters).sort({ predictionTime: -1 });
      break;
    case 'users':
      data = await User.find({ role: 'USER' }).select('-password -refreshToken');
      break;
    default:
      throw new ErrorResponse('Invalid report type', 400);
  }

  return {
    reportType,
    data,
    generatedAt: new Date()
  };
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  getAllTransactions,
  getModelMetrics,
  generateReports
};
