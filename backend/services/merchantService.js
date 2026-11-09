const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { parsePagination, parseSort } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');

const parseFilterDate = (value, fieldName) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ErrorResponse(`Invalid ${fieldName} format`, 400);
  }

  return date;
};

// Get merchant dashboard
const getMerchantDashboard = async (merchantId) => {
  const merchant = await User.findById(merchantId);

  if (!merchant || merchant.role !== 'MERCHANT') {
    throw new ErrorResponse('Merchant not found', 404);
  }

  // Get merchant's transactions
  const totalTransactions = await Transaction.countDocuments({ 'sender.userId': merchantId });
  const totalAmount = await Transaction.aggregate([
    { $match: { 'sender.userId': merchantId, status: 'SUCCESS' } },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  // Get today's transactions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTransactions = await Transaction.countDocuments({
    'sender.userId': merchantId,
    'timing.date': { $gte: today }
  });

  // Get today's amount
  const todayAmount = await Transaction.aggregate([
    {
      $match: {
        'sender.userId': merchantId,
        status: 'SUCCESS',
        'timing.date': { $gte: today }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  // Get recent transactions
  const recentTransactions = await Transaction.find({ 'sender.userId': merchantId })
    .sort({ 'timing.date': -1 })
    .limit(10);

  return {
    merchant: {
      id: merchant._id,
      fullName: merchant.fullName,
      email: merchant.email,
      upiId: merchant.upiId,
      bankName: merchant.bankName
    },
    totalTransactions,
    totalAmount: totalAmount[0]?.total || 0,
    todayTransactions,
    todayAmount: todayAmount[0]?.total || 0,
    recentTransactions
  };
};

// Get merchant transactions
const getMerchantTransactions = async (merchantId, filters = {}) => {
  const { page, limit, skip } = parsePagination(filters);
  const sort = parseSort(filters);

  const query = { 'sender.userId': merchantId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    query['timing.date'] = {};
    if (filters.startDate) {
      query['timing.date'].$gte = parseFilterDate(filters.startDate, 'start date');
    }
    if (filters.endDate) {
      query['timing.date'].$lte = parseFilterDate(filters.endDate, 'end date');
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

// Get merchant analytics
const getMerchantAnalytics = async (merchantId, filters = {}) => {
  const query = { 'sender.userId': merchantId };

  if (filters.startDate || filters.endDate) {
    query['timing.date'] = {};
    if (filters.startDate) {
      query['timing.date'].$gte = parseFilterDate(filters.startDate, 'start date');
    }
    if (filters.endDate) {
      query['timing.date'].$lte = parseFilterDate(filters.endDate, 'end date');
    }
  }

  // Transaction statistics
  const totalTransactions = await Transaction.countDocuments(query);
  const completedTransactions = await Transaction.countDocuments({ ...query, status: 'SUCCESS' });
  const failedTransactions = await Transaction.countDocuments({ ...query, status: 'FAILED' });
  const pendingTransactions = await Transaction.countDocuments({ ...query, status: 'PENDING' });

  // Amount statistics
  const amountStats = await Transaction.aggregate([
    { $match: { ...query, status: 'SUCCESS' } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' },
        maxAmount: { $max: '$amount' },
        minAmount: { $min: '$amount' }
      }
    }
  ]);

  // Transaction by category
  const categoryStats = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  // Transaction by payment method
  const paymentMethodStats = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  return {
    totalTransactions,
    completedTransactions,
    failedTransactions,
    pendingTransactions,
    successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions * 100).toFixed(2) : 0,
    amountStats: amountStats[0] || { totalAmount: 0, avgAmount: 0, maxAmount: 0, minAmount: 0 },
    categoryStats,
    paymentMethodStats
  };
};

module.exports = {
  getMerchantDashboard,
  getMerchantTransactions,
  getMerchantAnalytics
};
