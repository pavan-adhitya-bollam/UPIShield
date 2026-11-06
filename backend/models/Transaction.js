const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  referenceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  sender: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    upiId: String,
    accountNumber: String
  },
  receiver: {
    name: String,
    upiId: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  senderUpi: {
    type: String,
    required: true,
    trim: true
  },
  receiverUpi: {
    type: String,
    required: true,
    trim: true
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be greater than 0']
  },
  transactionType: {
    type: String,
    enum: ['P2P', 'P2M', 'SELF', 'BILL', 'RECHARGE', 'TRANSFER'],
    default: 'P2P'
  },
  merchantCategory: {
    type: String,
    trim: true,
    default: ''
  },
  purpose: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200,
    default: ''
  },
  note: {
    type: String,
    trim: true,
    maxlength: 250
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'PHONEPE', 'GOOGLE_PAY', 'PAYTM', 'BHIM'],
    default: 'UPI'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'BLOCKED'],
    default: 'PENDING'
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  fraudProbability: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  riskLevel: {
    type: String,
    enum: ['NO_HISTORY', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  predictionStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'SKIPPED', 'GENUINE', 'FRAUD'],
    default: 'PENDING'
  },
  assessmentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'INSUFFICIENT_TRANSACTION_HISTORY'],
    default: 'PENDING'
  },
  predictionProvider: {
    type: String,
    default: null
  },
  predictionConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  fraudReasons: [{
    feature: String,
    impact: Number,
    description: String
  }],
  deviceInfo: {
    deviceId: String,
    deviceName: String,
    deviceType: String,
    browser: String,
    os: String,
    isTrusted: Boolean
  },
  locationInfo: {
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  ipAddress: {
    type: String,
    trim: true
  },
  transactionTime: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  fraudAnalysis: {
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    fraudProbability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    riskLevel: {
      type: String,
      enum: ['NO_HISTORY', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    features: {
      customerBehaviourDeviation: Number,
      deviceChanged: Boolean,
      newBeneficiary: Boolean,
      locationChanged: Boolean,
      highVelocity: Boolean,
      transactionFrequency: Number,
      amountLast24Hours: Number
    },
    reasons: [{
      feature: String,
      impact: Number,
      description: String
    }],
    modelVersion: String,
    analysisTimestamp: Date
  },
  device: {
    deviceId: String,
    deviceName: String,
    deviceType: {
      type: String,
      enum: ['Mobile', 'Desktop', 'Tablet']
    },
    browser: String,
    os: String,
    ipAddress: String,
    location: {
      city: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number
    },
    isTrusted: {
      type: Boolean,
      default: false
    }
  },
  timing: {
    date: {
      type: Date,
      default: Date.now
    },
    time: String,
    hour: Number,
    dayOfWeek: String,
    isBusinessHour: {
      type: Boolean,
      default: true
    }
  },
  currency: {
    type: String,
    default: 'INR'
  },
  notes: String,
  isBeneficiarySaved: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  receiptUrl: String,
  isDemoData: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

transactionSchema.index({ 'sender.userId': 1, transactionTime: -1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ referenceNumber: 1 });
transactionSchema.index({ receiptNumber: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ riskLevel: 1 });
transactionSchema.index({ 'fraudAnalysis.riskLevel': 1 });
transactionSchema.index({ senderUpi: 1, receiverUpi: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
