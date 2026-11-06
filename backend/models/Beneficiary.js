const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  beneficiaryId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  upiId: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: String,
  bankName: String,
  ifscCode: String,
  nickname: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Family', 'Friend', 'Business', 'Service', 'Other'],
    default: 'Other'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  transactionCount: {
    type: Number,
    default: 0
  },
  totalAmountTransferred: {
    type: Number,
    default: 0
  },
  lastTransactionDate: Date,
  lastTransactionAmount: Number,
  isTrusted: {
    type: Boolean,
    default: false
  },
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
beneficiarySchema.index({ userId: 1, isActive: 1 });
beneficiarySchema.index({ upiId: 1 });
beneficiarySchema.index({ isFavorite: 1 });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
