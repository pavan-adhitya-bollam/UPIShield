const mongoose = require('mongoose');

const fraudPredictionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  predictionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  modelInfo: {
    modelName: {
      type: String,
      default: 'XGBoost'
    },
    modelVersion: {
      type: String,
      default: 'v2.1'
    },
    predictionThreshold: {
      type: Number,
      default: 0.65
    }
  },
  prediction: {
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    fraudProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    isFraud: {
      type: Boolean,
      required: true
    }
  },
  features: {
    customerBehaviourDeviation: Number,
    deviceChanged: Boolean,
    newBeneficiary: Boolean,
    locationChanged: Boolean,
    highVelocity: Boolean,
    transactionFrequency: Number,
    merchantCategory: String,
    amountLast24Hours: Number,
    transactionsLast1Minute: Number,
    transactionsLast5Minutes: Number,
    transactionsLast10Minutes: Number,
    transactionsLastHour: Number,
    amountSentLast5Minutes: Number,
    amountSentLast24Hours: Number,
    uniqueReceiversLast10Minutes: Number,
    uniqueReceiversToday: Number,
    historicalAverageAmount: Number,
    timeSincePreviousTransactionMs: Number,
    transactionFrequencyPerHour: Number,
    previousTransactionCount: Number,
    decimalPattern: Boolean,
    behavioralRiskContribution: Number,
    transactionAmount: Number,
    timeOfDay: Number,
    dayOfWeek: Number,
    isBusinessHour: Boolean,
    deviceType: String,
    browser: String,
    os: String,
    location: String
  },
  shapValues: {
    baseValue: Number,
    positiveContributors: [{
      feature: String,
      contribution: Number
    }],
    negativeContributors: [{
      feature: String,
      contribution: Number
    }]
  },
  featureImportance: [{
    feature: String,
    importance: Number,
    rank: Number
  }],
  reasons: [{
    feature: String,
    impact: Number,
    description: String
  }],
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    actualOutcome: {
      type: String,
      enum: ['Fraud', 'Genuine', 'Pending']
    },
    verificationNotes: String
  },
  actionTaken: {
    type: String,
    enum: ['None', 'Blocked', 'Flagged', 'Approved', 'Investigating'],
    default: 'None'
  },
  actionTakenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionTakenAt: Date,
  predictionTime: {
    type: Date,
    default: Date.now
  },
  processingTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
fraudPredictionSchema.index({ transactionId: 1 });
fraudPredictionSchema.index({ userId: 1, predictionTime: -1 });
fraudPredictionSchema.index({ 'prediction.riskLevel': 1 });
fraudPredictionSchema.index({ 'prediction.isFraud': 1 });

module.exports = mongoose.model('FraudPrediction', fraudPredictionSchema);
