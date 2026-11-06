export const fraudOverviewMetrics = [
  {
    id: 'total-transactions',
    title: 'Total Transactions Analyzed',
    value: '12,845',
    trend: { positive: true, value: 4.5 },
    label: 'month'
  },
  {
    id: 'fraudulent-transactions',
    title: 'Fraudulent Transactions',
    value: '1,142',
    trend: { positive: false, value: 8.1 },
    label: 'month'
  },
  {
    id: 'genuine-transactions',
    title: 'Genuine Transactions',
    value: '11,703',
    trend: { positive: true, value: 6.2 },
    label: 'month'
  },
  {
    id: 'fraud-rate',
    title: 'Fraud Rate',
    value: '8.9%',
    trend: { positive: false, value: 0.5 },
    label: 'rate'
  },
  {
    id: 'high-risk-transactions',
    title: 'High Risk Transactions',
    value: '624',
    trend: { positive: false, value: 12.3 },
    label: 'count'
  },
  {
    id: 'average-risk-score',
    title: 'Average Risk Score',
    value: '67.4',
    trend: { positive: true, value: 2.2 },
    label: 'score'
  }
]

export const fraudTransactions = [
  {
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
    deviceStatus: 'Changed',
    device: 'Android',
    riskScore: 92,
    fraudProbability: 91,
    riskLevel: 'CRITICAL',
    predictionStatus: 'Fraud',
    status: 'Flagged',
    referenceNumber: 'REF-02489',
    model: 'XGBoost',
    confidenceScore: 95,
    contributingFactors: ['New Beneficiary', 'Device Changed', 'Location Changed'],
    recommendedAction: 'Hold and escalate to analyst review',
    timeline: [
      { step: 'Transaction Created', status: 'completed', time: '09:53 PM', description: 'User initiated transaction' },
      { step: 'Fraud Analysis', status: 'completed', time: '09:53 PM', description: 'XGBoost model evaluated risk' },
      { step: 'High Risk Detected', status: 'completed', time: '09:54 PM', description: 'Transaction flagged for review' }
    ]
  },
  {
    id: 'TXN-02490',
    sender: 'Rahul Gupta',
    senderUpi: 'rahul@okhdfcbank',
    receiver: 'Pratik Jain',
    receiverUpi: 'pratik@okaxis',
    amount: 15200,
    transactionType: 'P2P Transfer',
    date: '2024-08-10',
    time: '09:12 AM',
    location: 'Mumbai',
    deviceStatus: 'Trusted',
    device: 'iOS',
    riskScore: 34,
    fraudProbability: 12,
    riskLevel: 'LOW',
    predictionStatus: 'Genuine',
    status: 'Completed',
    referenceNumber: 'REF-02490',
    model: 'XGBoost',
    confidenceScore: 88,
    contributingFactors: ['Normal Behaviour', 'Trusted Device'],
    recommendedAction: 'Approve transaction',
    timeline: [
      { step: 'Transaction Created', status: 'completed', time: '09:12 AM', description: 'User initiated transaction' },
      { step: 'Fraud Analysis', status: 'completed', time: '09:12 AM', description: 'XGBoost model evaluated risk' },
      { step: 'Approved', status: 'completed', time: '09:12 AM', description: 'Transaction safe for processing' }
    ]
  },
  {
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
    deviceStatus: 'Changed',
    device: 'Windows',
    riskScore: 71,
    fraudProbability: 67,
    riskLevel: 'HIGH',
    predictionStatus: 'Review Required',
    status: 'Review',
    referenceNumber: 'REF-02491',
    model: 'XGBoost',
    confidenceScore: 89,
    contributingFactors: ['Transaction Velocity', 'Behaviour Deviation'],
    recommendedAction: 'Request additional verification',
    timeline: [
      { step: 'Transaction Created', status: 'completed', time: '03:44 PM', description: 'User initiated transaction' },
      { step: 'Fraud Analysis', status: 'completed', time: '03:44 PM', description: 'XGBoost model evaluated risk' },
      { step: 'Pending Review', status: 'pending', time: '03:45 PM', description: 'Analyst verification required' }
    ]
  },
  {
    id: 'TXN-02492',
    sender: 'Amit Patel',
    senderUpi: 'amit@okhdfcbank',
    receiver: 'Ananya Shah',
    receiverUpi: 'ananya@okicici',
    amount: 8200,
    transactionType: 'P2P Transfer',
    date: '2024-08-09',
    time: '11:15 AM',
    location: 'Chennai',
    deviceStatus: 'Trusted',
    device: 'Android',
    riskScore: 48,
    fraudProbability: 35,
    riskLevel: 'MEDIUM',
    predictionStatus: 'Genuine',
    status: 'Completed',
    referenceNumber: 'REF-02492',
    model: 'XGBoost',
    confidenceScore: 91,
    contributingFactors: ['New Beneficiary', 'Amount Behaviour Deviation'],
    recommendedAction: 'Monitor transaction history',
    timeline: [
      { step: 'Transaction Created', status: 'completed', time: '11:15 AM', description: 'User initiated transaction' },
      { step: 'Fraud Analysis', status: 'completed', time: '11:15 AM', description: 'XGBoost model evaluated risk' },
      { step: 'Approved', status: 'completed', time: '11:15 AM', description: 'Transaction cleared' }
    ]
  },
  {
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
    deviceStatus: 'Changed',
    device: 'Linux',
    riskScore: 63,
    fraudProbability: 59,
    riskLevel: 'MEDIUM',
    predictionStatus: 'Review Required',
    status: 'Review',
    referenceNumber: 'REF-02493',
    model: 'XGBoost',
    confidenceScore: 87,
    contributingFactors: ['Location Changed', 'New Beneficiary'],
    recommendedAction: 'Request OTP verification',
    timeline: [
      { step: 'Transaction Created', status: 'completed', time: '07:28 PM', description: 'User initiated transaction' },
      { step: 'Fraud Analysis', status: 'completed', time: '07:28 PM', description: 'XGBoost model evaluated risk' },
      { step: 'Pending Review', status: 'pending', time: '07:29 PM', description: 'Analyst verification required' }
    ]
  }
]

export const riskDistributionData = [
  { level: 'LOW', count: 7800, color: '#10b981' },
  { level: 'MEDIUM', count: 3120, color: '#f59e0b' },
  { level: 'HIGH', count: 920, color: '#ef4444' },
  { level: 'CRITICAL', count: 215, color: '#8b5cf6' }
]

export const fraudTrendData = [
  { month: 'Feb', fraud: 120, genuine: 4950 },
  { month: 'Mar', fraud: 145, genuine: 5060 },
  { month: 'Apr', fraud: 165, genuine: 5100 },
  { month: 'May', fraud: 188, genuine: 5220 },
  { month: 'Jun', fraud: 210, genuine: 5340 },
  { month: 'Jul', fraud: 235, genuine: 5480 },
  { month: 'Aug', fraud: 258, genuine: 5600 }
]

export const fraudVsGenuineData = [
  { name: 'Fraud', value: 1428, color: '#ef4444' },
  { name: 'Genuine', value: 11417, color: '#10b981' }
]

export const topFraudIndicators = [
  { title: 'Customer Behaviour Deviation', contribution: 28, description: 'Anomalous spending patterns compared to previous history' },
  { title: 'Device Changed', contribution: 24, description: 'Device not seen before for this account' },
  { title: 'New Beneficiary', contribution: 21, description: 'Payee not present in the user’s beneficiary list' },
  { title: 'Location Changed', contribution: 18, description: 'Transaction issued from an unexpected location' },
  { title: 'Transaction Velocity', contribution: 16, description: 'Multiple rapid transactions detected' },
  { title: 'Amount Behaviour Deviation', contribution: 14, description: 'Amount exceeds normal transaction range' }
]

export const predictionStatuses = ['All', 'Fraud', 'Genuine', 'Review Required']
export const riskLevels = ['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
