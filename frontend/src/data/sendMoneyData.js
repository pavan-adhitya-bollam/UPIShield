// Mock data for Send Money module

export const recentBeneficiaries = [
  {
    id: 1,
    name: 'Rahul Sharma',
    upiId: 'rahul@okhdfcbank',
    avatar: 'RS',
    lastPaid: '2024-01-15',
    amount: 2500
  },
  {
    id: 2,
    name: 'Priya Patel',
    upiId: 'priya@okicici',
    avatar: 'PP',
    lastPaid: '2024-01-14',
    amount: 1500
  },
  {
    id: 3,
    name: 'Amit Kumar',
    upiId: 'amit@oksbi',
    avatar: 'AK',
    lastPaid: '2024-01-12',
    amount: 5000
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    upiId: 'sneha@okaxis',
    avatar: 'SR',
    lastPaid: '2024-01-10',
    amount: 800
  },
  {
    id: 5,
    name: 'Vikram Singh',
    upiId: 'vikram@okhdfcbank',
    avatar: 'VS',
    lastPaid: '2024-01-08',
    amount: 3200
  }
]

export const suspiciousIndicators = [
  {
    id: 1,
    label: 'New Device',
    detected: false,
    severity: 'medium'
  },
  {
    id: 2,
    label: 'New Beneficiary',
    detected: true,
    severity: 'low'
  },
  {
    id: 3,
    label: 'High Amount',
    detected: false,
    severity: 'high'
  },
  {
    id: 4,
    label: 'High Velocity',
    detected: false,
    severity: 'high'
  },
  {
    id: 5,
    label: 'Location Changed',
    detected: false,
    severity: 'medium'
  },
  {
    id: 6,
    label: 'Behaviour Deviation',
    detected: false,
    severity: 'low'
  }
]

export const quickTips = [
  {
    id: 1,
    icon: 'Shield',
    title: 'Verify Beneficiary',
    description: 'Always verify the UPI ID before sending money to avoid fraud'
  },
  {
    id: 2,
    icon: 'AlertTriangle',
    title: 'Set Transaction Limits',
    description: 'Set daily transaction limits to protect against unauthorized transfers'
  },
  {
    id: 3,
    icon: 'Lock',
    title: 'Use UPI PIN',
    description: 'Never share your UPI PIN with anyone, even bank officials'
  }
]

export const transactionTypes = [
  { value: 'person', label: 'Person to Person' },
  { value: 'merchant', label: 'Merchant Payment' },
  { value: 'bank', label: 'Bank Transfer' }
]

export const merchantCategories = [
  { value: 'retail', label: 'Retail Shopping' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' }
]

export const paymentMethods = [
  { value: 'upi', label: 'UPI', icon: 'Smartphone' },
  { value: 'bank', label: 'Bank Account', icon: 'Building2' },
  { value: 'card', label: 'Debit Card', icon: 'CreditCard' }
]

const formatTimelineTime = (timestamp) => timestamp
  ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  : null

export const createTimelineSteps = (events = {}) => {
  const fraudCheckStarted = Boolean(events.fraudCheckStartedAt)
  const fraudCheckCompleted = Boolean(events.fraudCheckCompletedAt)
  const mpinVerified = Boolean(events.mpinVerifiedAt)
  const paymentCompleted = Boolean(events.paymentCompletedAt)
  const paymentFailed = Boolean(events.paymentFailedAt)

  return [
    {
      id: 1,
      title: 'Payment Created',
      description: events.paymentCreatedAt ? 'Payment request started' : 'Not started',
      status: events.paymentCreatedAt ? 'completed' : 'idle',
      time: formatTimelineTime(events.paymentCreatedAt) || 'Not started'
    },
    {
      id: 2,
      title: 'Fraud Check',
      description: fraudCheckCompleted
        ? 'AI risk assessment completed'
        : fraudCheckStarted
          ? 'AI risk assessment in progress'
          : 'Not started',
      status: fraudCheckCompleted ? 'completed' : fraudCheckStarted ? 'pending' : 'idle',
      time: formatTimelineTime(events.fraudCheckCompletedAt || events.fraudCheckStartedAt) || 'Not started'
    },
    {
      id: 3,
      title: 'MPIN Authorization',
      description: mpinVerified ? 'MPIN verified' : fraudCheckCompleted ? 'Ready for secure authorization' : 'Not started',
      status: mpinVerified ? 'completed' : 'idle',
      time: formatTimelineTime(events.mpinVerifiedAt) || (fraudCheckCompleted ? 'Next' : 'Not started')
    },
    {
      id: 4,
      title: paymentFailed ? 'Payment Failed' : 'Payment Success',
      description: paymentCompleted
        ? 'Transaction completed'
        : paymentFailed
          ? 'Transaction was not completed'
          : 'Not started',
      status: paymentCompleted ? 'completed' : paymentFailed ? 'error' : 'idle',
      time: formatTimelineTime(events.paymentCompletedAt || events.paymentFailedAt) || 'Not started'
    }
  ]
}
