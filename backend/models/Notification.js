const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Transaction', 'Fraud', 'Login', 'Security', 'System', 'Promotion'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionType: {
    type: String,
    enum: ['Verify', 'Review', 'Confirm', 'None'],
    default: 'None'
  },
  actionUrl: String,
  relatedTransactionId: String,
  relatedUserId: String,
  metadata: {
    senderName: String,
    amount: Number,
    riskScore: Number,
    location: String,
    device: String
  },
  deliveryStatus: {
    email: {
      sent: Boolean,
      sentAt: Date,
      delivered: Boolean,
      deliveredAt: Date,
      opened: Boolean,
      openedAt: Date
    },
    sms: {
      sent: Boolean,
      sentAt: Date,
      delivered: Boolean,
      deliveredAt: Date
    },
    push: {
      sent: Boolean,
      sentAt: Date,
      delivered: Boolean,
      deliveredAt: Date,
      opened: Boolean,
      openedAt: Date
    }
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
