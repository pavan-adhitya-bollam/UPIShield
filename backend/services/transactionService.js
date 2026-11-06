const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Beneficiary = require('../models/Beneficiary');
const fraudService = require('./fraudService');
const {
  generateTransactionId,
  generateReferenceNumber,
  generateReceiptNumber,
  parsePagination
} = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');

const normalizeRole = (role) => String(role || '').toUpperCase();

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const buildDeviceInfo = (headers = {}) => ({
  deviceId: headers['x-device-id'] || null,
  deviceName: headers['x-device-name'] || 'Unknown',
  deviceType: headers['x-device-type'] || 'Mobile',
  browser: headers['user-agent'] || 'Unknown',
  os: headers['x-os'] || 'Unknown',
  isTrusted: headers['x-trusted-device'] === 'true'
});

const buildLocationInfo = (headers = {}) => ({
  city: headers['x-city'] || null,
  state: headers['x-state'] || null,
  country: headers['x-country'] || null,
  latitude: headers['x-latitude'] ? Number(headers['x-latitude']) : undefined,
  longitude: headers['x-longitude'] ? Number(headers['x-longitude']) : undefined
});

const verifyMpinAuthorization = (user, token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.purpose === 'payment-mpin' && payload.userId === String(user._id);
  } catch (error) {
    return false;
  }
};

const assessTransaction = async (user, transactionData, headers = {}, ipAddress = '') => {
  const sender = await User.findById(user._id).select('email +mpinHash');

  if (!sender) {
    throw new ErrorResponse('User not found', 404);
  }

  const deviceInfo = buildDeviceInfo(headers);
  const locationInfo = buildLocationInfo(headers);
  const receiverUpi = transactionData.receiverUpi;

  const assessment = await fraudService.assessTransaction({
    userId: sender._id,
    senderUpiId: sender.email,
    receiverUpiId: receiverUpi,
    amount: Number(transactionData.amount),
    merchantCategory: transactionData.merchantCategory || '',
    deviceId: deviceInfo.deviceId,
    deviceType: deviceInfo.deviceType,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    ipAddress,
    location: locationInfo
  });

  return {
    ...assessment,
    hasMPIN: Boolean(sender.mpinHash)
  };
};

const createMpin = async (user, mpin) => {
  const sender = await User.findById(user._id).select('+mpinHash');

  if (!sender) {
    throw new ErrorResponse('User not found', 404);
  }

  if (sender.mpinHash) {
    throw new ErrorResponse('MPIN already exists', 409);
  }

  await sender.setMpin(mpin);
  return { hasMPIN: true };
};

const getTransactionQuery = (user) => {
  if (normalizeRole(user.role) === 'ADMIN') {
    return {};
  }

  return { 'sender.userId': user._id };
};

const buildTransactionQuery = (user, filters = {}) => {
  const query = getTransactionQuery(user);

  if (filters.search) {
    query.$or = [
      { transactionId: { $regex: filters.search, $options: 'i' } },
      { referenceNumber: { $regex: filters.search, $options: 'i' } },
      { receiptNumber: { $regex: filters.search, $options: 'i' } },
      { senderUpi: { $regex: filters.search, $options: 'i' } },
      { receiverUpi: { $regex: filters.search, $options: 'i' } },
      { purpose: { $regex: filters.search, $options: 'i' } },
      { note: { $regex: filters.search, $options: 'i' } },
      { merchantCategory: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.riskLevel) {
    query.riskLevel = filters.riskLevel;
  }

  if (filters.transactionType) {
    query.transactionType = filters.transactionType;
  }

  if (filters.merchantCategory) {
    query.merchantCategory = { $regex: filters.merchantCategory, $options: 'i' };
  }

  if (filters.startDate || filters.endDate) {
    query.transactionTime = {};
    if (filters.startDate) {
      query.transactionTime.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.transactionTime.$lte = new Date(filters.endDate);
    }
  }

  if (filters.minAmount || filters.maxAmount) {
    query.amount = {};
    if (filters.minAmount) {
      query.amount.$gte = Number(filters.minAmount);
    }
    if (filters.maxAmount) {
      query.amount.$lte = Number(filters.maxAmount);
    }
  }

  return query;
};

const sendMoney = async (user, transactionData, headers = {}, ipAddress = '') => {
  if (!verifyMpinAuthorization(user, transactionData.mpinAuthorization)) {
    throw new ErrorResponse('MPIN authorization required', 401);
  }

  const sender = await User.findById(user._id).select('-password -refreshToken');

  if (!sender) {
    throw new ErrorResponse('User not found', 404);
  }

  if (!sender.isActive) {
    throw new ErrorResponse('Account is not active', 403);
  }

  const amount = Number(transactionData.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ErrorResponse('Amount must be greater than 0', 400);
  }

  const dailyLimit = Number(process.env.TRANSACTION_DAILY_LIMIT || 1000000);
  if (amount > dailyLimit) {
    throw new ErrorResponse('Amount exceeds transaction limit', 400);
  }

  const receiverUpi = transactionData.receiverUpi;
  const senderUpi = transactionData.senderUpi || sender.email;
  const beneficiary = await Beneficiary.findOne({
    userId: sender._id,
    upiId: receiverUpi,
    isActive: true
  });

  const deviceInfo = buildDeviceInfo(headers);
  const locationInfo = buildLocationInfo(headers);
  const transactionTime = new Date();

  const transaction = await Transaction.create({
    transactionId: generateTransactionId(),
    referenceNumber: generateReferenceNumber(),
    receiptNumber: generateReceiptNumber(),
    sender: {
      userId: sender._id,
      name: `${sender.firstName} ${sender.lastName}`.trim(),
      upiId: senderUpi,
      accountNumber: sender.accountNumber || null
    },
    receiver: {
      name: beneficiary?.name || null,
      upiId: receiverUpi,
      accountNumber: beneficiary?.accountNumber || null,
      bankName: beneficiary?.bankName || null,
      ifscCode: beneficiary?.ifscCode || null
    },
    senderUpi,
    receiverUpi,
    beneficiary: beneficiary?._id || null,
    amount,
    transactionType: transactionData.transactionType || (transactionData.merchantCategory ? 'P2M' : 'P2P'),
    merchantCategory: transactionData.merchantCategory || '',
    purpose: transactionData.purpose || '',
    note: transactionData.note || '',
    paymentMethod: transactionData.paymentMethod || 'UPI',
    status: 'PENDING',
    riskScore: 0,
    fraudProbability: null,
    riskLevel: 'LOW',
    predictionStatus: 'PENDING',
    assessmentStatus: 'PENDING',
    predictionProvider: null,
    predictionConfidence: 0,
    fraudReasons: [],
    deviceInfo,
    locationInfo,
    ipAddress,
    transactionTime,
    completedAt: null,
    device: {
      deviceId: deviceInfo.deviceId,
      deviceName: deviceInfo.deviceName,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress,
      location: locationInfo,
      isTrusted: deviceInfo.isTrusted
    },
    timing: {
      date: transactionTime,
      time: transactionTime.toLocaleTimeString(),
      hour: transactionTime.getHours(),
      dayOfWeek: transactionTime.toLocaleDateString('en-US', { weekday: 'long' }),
      isBusinessHour: transactionTime.getHours() >= 9 && transactionTime.getHours() < 18
    },
    notes: transactionData.note || '',
    isBeneficiarySaved: !!beneficiary,
    receiptGenerated: false,
    receiptUrl: null
  });

  if (beneficiary) {
    beneficiary.transactionCount += 1;
    beneficiary.totalAmountTransferred += amount;
    beneficiary.lastTransactionDate = transactionTime;
    beneficiary.lastTransactionAmount = amount;
    await beneficiary.save();
  }

  const analysis = await fraudService.analyzeTransaction({
    userId: sender._id,
    transactionId: transaction.transactionId,
    senderUpiId: senderUpi,
    receiverUpiId: receiverUpi,
    amount,
    deviceId: deviceInfo.deviceId,
    deviceType: deviceInfo.deviceType,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    ipAddress,
    location: locationInfo
  });

  const analyzedTransaction = await Transaction.findOne({ transactionId: transaction.transactionId });
  if (!analyzedTransaction) {
    throw new ErrorResponse('Transaction could not be finalized', 500);
  }

  const finalStatus = analysis.isFraud ? 'BLOCKED' : 'SUCCESS';
  const fraudReasons = (analysis.reasons || []).map((reason) => (
    typeof reason === 'string'
      ? { feature: reason, impact: 0.1, description: reason }
      : reason
  ));

  analyzedTransaction.riskScore = analysis.riskScore;
  analyzedTransaction.fraudProbability = analysis.fraudProbability ?? null;
  analyzedTransaction.riskLevel = analysis.riskLevel;
  analyzedTransaction.predictionStatus = analysis.predictionStatus || 'COMPLETED';
  analyzedTransaction.assessmentStatus = analysis.assessmentStatus || 'COMPLETED';
  analyzedTransaction.predictionProvider = analysis.provider || 'NONE';
  analyzedTransaction.predictionConfidence = analysis.confidence;
  analyzedTransaction.fraudReasons = fraudReasons;
  analyzedTransaction.status = finalStatus;
  analyzedTransaction.completedAt = finalStatus === 'SUCCESS' ? new Date() : null;
  analyzedTransaction.paymentStatus = finalStatus === 'SUCCESS' ? 'Success' : 'Failed';
  analyzedTransaction.receiptGenerated = finalStatus === 'SUCCESS';

  await analyzedTransaction.save();

  return {
    transaction: analyzedTransaction
  };
};

const authorizeMpin = async (user, mpin) => {
  const sender = await User.findById(user._id).select('+mpinHash');

  if (!sender || !sender.mpinHash || !await sender.compareMpin(mpin)) {
    throw new ErrorResponse('Incorrect MPIN', 400);
  }

  const token = jwt.sign(
    { userId: String(user._id), purpose: 'payment-mpin' },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  return { authorizationToken: token };
};

const getTransactionHistory = async (user, filters = {}) => {
  const { page, limit, skip } = parsePagination(filters);
  const sortField = ['transactionTime', 'amount', 'status', 'riskScore', 'createdAt'].includes(filters.sortBy)
    ? filters.sortBy
    : 'transactionTime';
  const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

  const query = buildTransactionQuery(user, filters);

  const transactions = await Transaction.find(query)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();

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

const getTransactionDetails = async (id, user) => {
  const query = getTransactionQuery(user);
  query.$or = [
    { transactionId: id },
    { referenceNumber: id },
    { receiptNumber: id },
    { _id: id }
  ];

  const transaction = await Transaction.findOne(query).lean();

  if (!transaction) {
    throw new ErrorResponse('Transaction not found', 404);
  }

  return transaction;
};

const downloadReceipt = async (id, user) => {
  const transaction = await getTransactionDetails(id, user);

  if (transaction.status !== 'SUCCESS') {
    throw new ErrorResponse('Receipt not available for incomplete transactions', 400);
  }

  return {
    transactionId: transaction.transactionId,
    sender: transaction.sender,
    receiver: transaction.receiver,
    referenceNumber: transaction.referenceNumber,
    riskLevel: transaction.riskLevel,
    fraudProbability: transaction.fraudProbability,
    timestamp: transaction.transactionTime,
    receiptNumber: transaction.receiptNumber,
    amount: transaction.amount,
    status: transaction.status
  };
};

const exportCsv = async (user, filters = {}) => {
  const query = buildTransactionQuery(user, filters);
  const transactions = await Transaction.find(query).sort({ transactionTime: -1 }).lean();

  const csvHeaders = [
    'Transaction ID',
    'Reference Number',
    'Receipt Number',
    'Transaction Time',
    'Sender UPI',
    'Receiver UPI',
    'Amount',
    'Status',
    'Risk Level',
    'Fraud Probability',
    'Transaction Type',
    'Merchant Category',
    'Purpose',
    'Note',
    'Payment Method'
  ];

  const csvRows = transactions.map((transaction) => [
    transaction.transactionId,
    transaction.referenceNumber,
    transaction.receiptNumber || '',
    transaction.transactionTime ? new Date(transaction.transactionTime).toISOString() : '',
    transaction.senderUpi,
    transaction.receiverUpi,
    transaction.amount,
    transaction.status,
    transaction.riskLevel,
    transaction.fraudProbability,
    transaction.transactionType,
    transaction.merchantCategory || '',
    transaction.purpose || '',
    transaction.note || '',
    transaction.paymentMethod
  ]);

  const csvContent = [
    csvHeaders.map(escapeCsvValue).join(','),
    ...csvRows.map((row) => row.map(escapeCsvValue).join(','))
  ].join('\n');

  return {
    csvContent,
    filename: `transactions_${new Date().toISOString().split('T')[0]}.csv`
  };
};

const cancelTransaction = async (id, user) => {
  const transaction = await getTransactionDetails(id, user);

  if (!['PENDING', 'PROCESSING'].includes(transaction.status)) {
    throw new ErrorResponse('Cannot cancel non-pending transaction', 400);
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(transaction._id, {
    status: 'CANCELLED',
    predictionStatus: 'FAILED',
    completedAt: new Date(),
    paymentStatus: 'Failed'
  }, { new: true }).lean();

  return {
    message: 'Transaction cancelled successfully',
    transaction: updatedTransaction
  };
};

module.exports = {
  sendMoney,
  assessTransaction,
  createMpin,
  authorizeMpin,
  getTransactionHistory,
  getTransactionDetails,
  downloadReceipt,
  exportCsv,
  cancelTransaction
};
