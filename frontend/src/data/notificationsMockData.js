export const notificationsList = [
  {
    id: 'NOTIF-001',
    type: 'FRAUD_ALERT',
    title: 'High Risk Transaction Detected',
    description: 'Transaction TXN001234567 flagged with 92% fraud probability. Review immediately.',
    timestamp: '2024-08-11 17:42',
    priority: 'High',
    transactionId: 'TXN001234567',
    riskScore: 92,
    fraudProbability: 92,
    riskLevel: 'CRITICAL',
    reason: 'New beneficiary, unusual device, and increased velocity',
    action: 'Review Fraud',
    read: false
  },
  {
    id: 'NOTIF-002',
    type: 'TRANSACTION',
    title: 'Payment Successful',
    description: '₹12,500 transferred to Amazon India successfully.',
    timestamp: '2024-08-11 16:10',
    priority: 'Normal',
    transactionId: 'TXN001234568',
    read: false
  },
  {
    id: 'NOTIF-003',
    type: 'SECURITY',
    title: 'New Device Login',
    description: 'Login detected from a new device in Bengaluru.',
    timestamp: '2024-08-11 15:35',
    priority: 'Medium',
    read: true
  },
  {
    id: 'NOTIF-004',
    type: 'LOGIN',
    title: 'OTP Verified',
    description: 'OTP verification completed for transaction TXN001234570.',
    timestamp: '2024-08-11 14:55',
    priority: 'Low',
    transactionId: 'TXN001234570',
    read: true
  },
  {
    id: 'NOTIF-005',
    type: 'SYSTEM',
    title: 'System Alert',
    description: 'Scheduled maintenance tonight from 12 AM to 2 AM.',
    timestamp: '2024-08-10 20:00',
    priority: 'Medium',
    read: false
  },
  {
    id: 'NOTIF-006',
    type: 'PROMOTION',
    title: 'Cashback Offer',
    description: 'Earn 5% cashback on UPI merchant payments this weekend.',
    timestamp: '2024-08-10 18:30',
    priority: 'Low',
    read: true
  }
]

export const notificationSummary = {
  all: 42,
  unread: 18,
  fraudAlerts: 7,
  transactionAlerts: 12,
  securityAlerts: 9
}

export const notificationTypeLabels = {
  FRAUD_ALERT: 'Fraud Alert',
  TRANSACTION: 'Transaction',
  SECURITY: 'Security',
  LOGIN: 'Login',
  SYSTEM: 'System',
  PROMOTION: 'Promotion'
}

export const notificationFilters = [
  { id: 'all', label: 'All' },
  { id: 'fraud-alert', label: 'Fraud Alerts' },
  { id: 'transaction', label: 'Transaction' },
  { id: 'security', label: 'Security' },
  { id: 'login', label: 'Login' },
  { id: 'system', label: 'System' },
  { id: 'promotion', label: 'Promotion' }
]

export const notificationTypeStyles = {
  FRAUD_ALERT: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25' },
  TRANSACTION: { bg: 'bg-primary-500/10', text: 'text-primary-300', border: 'border-primary-500/25' },
  SECURITY: { bg: 'bg-yellow-500/15', text: 'text-yellow-300', border: 'border-yellow-500/25' },
  LOGIN: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/25' },
  SYSTEM: { bg: 'bg-gray-500/15', text: 'text-gray-300', border: 'border-white/20' },
  PROMOTION: { bg: 'bg-green-500/15', text: 'text-green-300', border: 'border-green-500/25' }
}
