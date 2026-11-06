// Mock data for Fraud Result page

export const fraudPredictionData = {
  fraudProbability: 18,
  riskLevel: 'LOW',
  confidence: 96,
  prediction: 'SAFE',
  predictionTime: new Date().toISOString(),
  modelVersion: 'v2.4.1',
  analysisDuration: '0.8s'
}

export const riskExplanationCards = [
  {
    id: 1,
    feature: 'Behaviour Deviation',
    riskWeight: '+12%',
    explanation: 'Transaction pattern deviates from normal user behaviour',
    detected: true,
    severity: 'medium'
  },
  {
    id: 2,
    feature: 'Device Changed',
    riskWeight: '+18%',
    explanation: 'This transaction originated from a new device',
    detected: false,
    severity: 'high'
  },
  {
    id: 3,
    feature: 'New Beneficiary',
    riskWeight: '+15%',
    explanation: 'First-time payment to this beneficiary',
    detected: true,
    severity: 'medium'
  },
  {
    id: 4,
    feature: 'Transaction Velocity',
    riskWeight: '+8%',
    explanation: 'Multiple transactions in short time window',
    detected: false,
    severity: 'low'
  },
  {
    id: 5,
    feature: 'Location Changed',
    riskWeight: '+20%',
    explanation: 'Transaction from unusual geographic location',
    detected: false,
    severity: 'high'
  },
  {
    id: 6,
    feature: 'Large Amount',
    riskWeight: '+25%',
    explanation: 'Amount exceeds typical transaction range',
    detected: false,
    severity: 'high'
  }
]

export const transactionSummary = {
  sender: {
    name: 'John Doe',
    upiId: 'john@okhdfcbank',
    account: 'XXXX-XXXX-1234'
  },
  receiver: {
    name: 'Rahul Sharma',
    upiId: 'rahul@okicici',
    account: 'XXXX-XXXX-5678'
  },
  amount: 5000,
  purpose: 'Rent Payment',
  transactionTime: new Date().toISOString(),
  location: 'Mumbai, Maharashtra',
  transactionType: 'Person to Person',
  merchantCategory: null,
  device: 'iPhone 15 Pro',
  ipAddress: '192.168.1.100'
}

export const aiRecommendations = {
  LOW: {
    title: 'Proceed Normally',
    description: 'Transaction is safe to proceed. Enter your 6-digit MPIN to authorize it.',
    color: 'green',
    icon: 'CheckCircle'
  },
  MEDIUM: {
    title: 'Require MPIN Authorization',
    description: 'Enter your 6-digit MPIN to authorize this payment',
    color: 'yellow',
    icon: 'Shield'
  },
  HIGH: {
    title: 'Block Transaction',
    description: 'Transaction blocked due to high fraud risk',
    color: 'red',
    icon: 'XCircle'
  },
  CRITICAL: {
    title: 'Freeze Transaction',
    description: 'Account frozen pending manual review',
    color: 'purple',
    icon: 'AlertTriangle'
  }
}

export const fraudTimeline = [
  {
    id: 1,
    title: 'Transaction Created',
    description: 'Payment request initiated by user',
    status: 'completed',
    time: '10:30:15 AM'
  },
  {
    id: 2,
    title: 'ML Analysis',
    description: 'AI model analyzing transaction patterns',
    status: 'completed',
    time: '10:30:16 AM'
  },
  {
    id: 3,
    title: 'Risk Calculation',
    description: 'Computing fraud probability scores',
    status: 'completed',
    time: '10:30:17 AM'
  },
  {
    id: 4,
    title: 'Recommendation',
    description: 'AI recommendation generated',
    status: 'completed',
    time: '10:30:18 AM'
  },
  {
    id: 5,
    title: 'Final Decision',
    description: 'Transaction approved for processing',
    status: 'completed',
    time: '10:30:19 AM'
  }
]

export const featureImportance = [
  {
    feature: 'Customer Behaviour Deviation',
    importance: 0.32,
    color: '#ef4444'
  },
  {
    feature: 'Device Changed',
    importance: 0.24,
    color: '#f59e0b'
  },
  {
    feature: 'Transaction Velocity',
    importance: 0.18,
    color: '#10b981'
  },
  {
    feature: 'Location Changed',
    importance: 0.12,
    color: '#3b82f6'
  },
  {
    feature: 'Beneficiary History',
    importance: 0.08,
    color: '#8b5cf6'
  },
  {
    feature: 'Amount',
    importance: 0.06,
    color: '#ec4899'
  }
]

export const similarTransactions = [
  {
    id: 'TXN001',
    amount: 4500,
    risk: 12,
    status: 'Completed',
    date: '2024-01-15'
  },
  {
    id: 'TXN002',
    amount: 5200,
    risk: 18,
    status: 'Completed',
    date: '2024-01-14'
  },
  {
    id: 'TXN003',
    amount: 4800,
    risk: 8,
    status: 'Completed',
    date: '2024-01-12'
  },
  {
    id: 'TXN004',
    amount: 6000,
    risk: 25,
    status: 'Flagged',
    date: '2024-01-10'
  },
  {
    id: 'TXN005',
    amount: 5000,
    risk: 15,
    status: 'Completed',
    date: '2024-01-08'
  }
]

export const suggestedActions = [
  {
    id: 1,
    label: 'Proceed Payment',
    icon: 'Check',
    variant: 'primary',
    visibleFor: ['LOW']
  },
  {
    id: 2,
    label: 'Enter MPIN',
    icon: 'Shield',
    variant: 'secondary',
    visibleFor: ['MEDIUM']
  },
  {
    id: 3,
    label: 'Cancel Payment',
    icon: 'X',
    variant: 'danger',
    visibleFor: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  },
  {
    id: 4,
    label: 'Report Suspicious',
    icon: 'AlertTriangle',
    variant: 'warning',
    visibleFor: ['MEDIUM', 'HIGH', 'CRITICAL']
  }
]
