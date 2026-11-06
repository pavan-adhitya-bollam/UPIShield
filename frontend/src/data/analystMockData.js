export const analystOverviewMetrics = [
  {
    id: 'cases-assigned',
    title: 'Cases Assigned',
    value: '68',
    trend: { positive: true, value: 6.4 }
  },
  {
    id: 'open-cases',
    title: 'Open Cases',
    value: '24',
    trend: { positive: false, value: 3.8 }
  },
  {
    id: 'high-risk-cases',
    title: 'High Risk Cases',
    value: '18',
    trend: { positive: false, value: 9.7 }
  },
  {
    id: 'cases-resolved',
    title: 'Cases Resolved',
    value: '112',
    trend: { positive: true, value: 14.5 }
  },
  {
    id: 'fraud-confirmed',
    title: 'Fraud Confirmed',
    value: '34',
    trend: { positive: true, value: 4.8 }
  },
  {
    id: 'false-positives',
    title: 'False Positives',
    value: '9',
    trend: { positive: false, value: 1.2 }
  }
]

export const investigationQueue = [
  {
    caseId: 'CASE-7101',
    transactionId: 'TXN-02489',
    customer: 'Neha Mehta',
    amount: 47200,
    riskScore: 92,
    riskLevel: 'CRITICAL',
    fraudType: 'Merchant Payment Fraud',
    assignedAnalyst: 'Anika Roy',
    createdTime: '2024-08-10 09:54',
    status: 'NEW',
    transaction: {
      id: 'TXN-02489',
      sender: 'Neha Mehta',
      senderUpi: 'neha@oksbi',
      receiver: 'Unknown Merchant',
      receiverUpi: 'unknown@okhdfcbank',
      amount: 47200,
      transactionType: 'Merchant Payment',
      date: '2024-08-10',
      time: '09:53 PM',
      location: 'New Delhi',
      device: 'Android',
      deviceStatus: 'Changed',
      paymentStatus: 'Blocked',
      referenceNumber: 'REF-02489',
      model: 'XGBoost',
      confidenceScore: 95,
      customerTier: 'Premium',
      priorTransactions: 52,
      averageAmount: 8200,
      balance: '₹68,240',
      beneficiaryHistory: 'None',
      velocity: '5 txns/hr'
    },
    analysisNotes: [
      { id: 1, author: 'Anika Roy', timestamp: '2024-08-10 10:05', text: 'Transaction from a new merchant with unusual device.' }
    ]
  },
  {
    caseId: 'CASE-7102',
    transactionId: 'TXN-02491',
    customer: 'Sanya Singh',
    amount: 32500,
    riskScore: 71,
    riskLevel: 'HIGH',
    fraudType: 'Transfer Velocity',
    assignedAnalyst: 'Rohit Sharma',
    createdTime: '2024-08-09 15:02',
    status: 'UNDER_REVIEW',
    transaction: {
      id: 'TXN-02491',
      sender: 'Sanya Singh',
      senderUpi: 'sanya@oksbi',
      receiver: 'Vipul Traders',
      receiverUpi: 'vipul@paytm',
      amount: 32500,
      transactionType: 'Merchant Payment',
      date: '2024-08-09',
      time: '03:44 PM',
      location: 'Bengaluru',
      device: 'Windows',
      deviceStatus: 'Changed',
      paymentStatus: 'Review',
      referenceNumber: 'REF-02491',
      model: 'XGBoost',
      confidenceScore: 89,
      customerTier: 'Standard',
      priorTransactions: 84,
      averageAmount: 10750,
      balance: '₹12,160',
      beneficiaryHistory: 'New Beneficiary',
      velocity: '3 txns/hr'
    },
    analysisNotes: [
      { id: 2, author: 'Rohit Sharma', timestamp: '2024-08-09 15:10', text: 'High velocity with new beneficiary and device anomaly.' }
    ]
  },
  {
    caseId: 'CASE-7103',
    transactionId: 'TXN-02493',
    customer: 'Priya Nair',
    amount: 18500,
    riskScore: 63,
    riskLevel: 'MEDIUM',
    fraudType: 'Location Change',
    assignedAnalyst: 'Anika Roy',
    createdTime: '2024-08-08 19:06',
    status: 'ESCALATED',
    transaction: {
      id: 'TXN-02493',
      sender: 'Priya Nair',
      senderUpi: 'priya@okaxis',
      receiver: 'Krishna Kumar',
      receiverUpi: 'krishna@okhdfcbank',
      amount: 18500,
      transactionType: 'P2P Transfer',
      date: '2024-08-08',
      time: '07:28 PM',
      location: 'Pune',
      device: 'Linux',
      deviceStatus: 'Changed',
      paymentStatus: 'Review',
      referenceNumber: 'REF-02493',
      model: 'XGBoost',
      confidenceScore: 87,
      customerTier: 'Standard',
      priorTransactions: 21,
      averageAmount: 6300,
      balance: '₹8,930',
      beneficiaryHistory: 'Existing',
      velocity: '2 txns/hr'
    },
    analysisNotes: [
      { id: 3, author: 'Anika Roy', timestamp: '2024-08-08 19:20', text: 'Unusual location compared to last 30 days.' }
    ]
  }
]

export const analystChartData = {
  fraudCasesByDay: [
    { month: 'Mon', fraud: 10, genuine: 420 },
    { month: 'Tue', fraud: 12, genuine: 450 },
    { month: 'Wed', fraud: 9, genuine: 400 },
    { month: 'Thu', fraud: 15, genuine: 430 },
    { month: 'Fri', fraud: 18, genuine: 470 },
    { month: 'Sat', fraud: 7, genuine: 320 },
    { month: 'Sun', fraud: 5, genuine: 280 }
  ],
  fraudCasesByType: [
    { type: 'P2P Transfer', fraud: 45 },
    { type: 'Merchant Payment', fraud: 32 },
    { type: 'Subscription', fraud: 14 },
    { type: 'Bill Payment', fraud: 8 }
  ],
  confirmedVsFalsePositive: [
    { name: 'Confirmed Fraud', value: 34, color: '#ef4444' },
    { name: 'False Positive', value: 9, color: '#10b981' }
  ],
  investigationTimeTrend: [
    { month: 'Jan', fraud: 18, genuine: 72 },
    { month: 'Feb', fraud: 21, genuine: 68 },
    { month: 'Mar', fraud: 16, genuine: 80 },
    { month: 'Apr', fraud: 14, genuine: 75 },
    { month: 'May', fraud: 12, genuine: 82 },
    { month: 'Jun', fraud: 10, genuine: 88 }
  ],
  riskLevelDistribution: [
    { level: 'LOW', count: 240, color: '#10b981' },
    { level: 'MEDIUM', count: 130, color: '#f59e0b' },
    { level: 'HIGH', count: 60, color: '#ef4444' },
    { level: 'CRITICAL', count: 22, color: '#8b5cf6' }
  ],
  resolutionByAnalyst: [
    { name: 'Anika Roy', value: 28, color: '#a855f7' },
    { name: 'Rohit Sharma', value: 24, color: '#0ea5e9' },
    { name: 'Priya Verma', value: 18, color: '#10b981' },
    { name: 'Deepak Kumar', value: 12, color: '#f59e0b' }
  ]
}

export const investigationTimelineSteps = [
  { id: 1, title: 'Transaction Created', status: 'completed', time: '09:53 PM', description: 'Transaction submitted into the platform' },
  { id: 2, title: 'ML Analysis', status: 'completed', time: '09:53 PM', description: 'XGBoost prediction evaluated transaction risk' },
  { id: 3, title: 'High Risk Detected', status: 'completed', time: '09:54 PM', description: 'Case created for analyst review' },
  { id: 4, title: 'Assigned to Analyst', status: 'completed', time: '09:55 PM', description: 'Case assigned to fraud team' },
  { id: 5, title: 'Under Investigation', status: 'pending', time: '09:58 PM', description: 'Analyst working on case' }
]
