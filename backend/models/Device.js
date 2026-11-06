const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    enum: ['Mobile', 'Desktop', 'Tablet'],
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  location: {
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  isCurrentDevice: {
    type: Boolean,
    default: false
  },
  isTrusted: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  firstSeen: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Blocked', 'Removed'],
    default: 'Active'
  },
  loginCount: {
    type: Number,
    default: 0
  },
  lastLoginAt: Date
}, {
  timestamps: true
});

// Indexes
deviceSchema.index({ userId: 1, status: 1 });
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ isCurrentDevice: 1 });

module.exports = mongoose.model('Device', deviceSchema);
