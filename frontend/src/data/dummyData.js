export const userStats = {
  totalBalance: 125000,
  monthlySpending: 45000,
  fraudAttemptsBlocked: 12,
  riskScore: 15,
  transactionsThisMonth: 45,
  savingsGoal: 50000,
  currentSavings: 32000,
}

export const recentTransactions = [
  {
    id: 'TXN001',
    name: 'Amazon India',
    amount: 2450,
    date: '2024-01-15',
    time: '14:30',
    type: 'debit',
    category: 'Shopping',
    status: 'completed',
    riskLevel: 'low',
  },
  {
    id: 'TXN002',
    name: 'Rahul Sharma',
    amount: 5000,
    date: '2024-01-15',
    time: '12:15',
    type: 'debit',
    category: 'Transfer',
    status: 'completed',
    riskLevel: 'low',
  },
  {
    id: 'TXN003',
    name: 'Salary Credit',
    amount: 75000,
    date: '2024-01-14',
    time: '09:00',
    type: 'credit',
    category: 'Income',
    status: 'completed',
    riskLevel: 'low',
  },
  {
    id: 'TXN004',
    name: 'Unknown Merchant',
    amount: 15000,
    date: '2024-01-14',
    time: '18:45',
    type: 'debit',
    category: 'Shopping',
    status: 'flagged',
    riskLevel: 'high',
  },
  {
    id: 'TXN005',
    name: 'Netflix Subscription',
    amount: 649,
    date: '2024-01-13',
    time: '10:00',
    type: 'debit',
    category: 'Entertainment',
    status: 'completed',
    riskLevel: 'low',
  },
  {
    id: 'TXN006',
    name: 'Electricity Bill',
    amount: 3200,
    date: '2024-01-12',
    time: '16:30',
    type: 'debit',
    category: 'Utilities',
    status: 'completed',
    riskLevel: 'low',
  },
]

export const fraudTrendData = [
  { month: 'Aug', fraud: 45, blocked: 42 },
  { month: 'Sep', fraud: 52, blocked: 48 },
  { month: 'Oct', fraud: 38, blocked: 36 },
  { month: 'Nov', fraud: 65, blocked: 60 },
  { month: 'Dec', fraud: 48, blocked: 45 },
  { month: 'Jan', fraud: 35, blocked: 33 },
]

export const categoryData = [
  { name: 'Shopping', value: 35, color: '#a855f7' },
  { name: 'Transfers', value: 25, color: '#0ea5e9' },
  { name: 'Utilities', value: 15, color: '#10b981' },
  { name: 'Entertainment', value: 12, color: '#f59e0b' },
  { name: 'Others', value: 13, color: '#6b7280' },
]

export const fraudDetectionResult = {
  transactionId: 'TXN004',
  fraudProbability: 0.78,
  riskLevel: 'high',
  confidence: 0.92,
  importantFeatures: [
    { feature: 'New Beneficiary', impact: 0.85, value: 'True' },
    { feature: 'Device Changed', impact: 0.72, value: 'True' },
    { feature: 'Location Changed', impact: 0.65, value: 'True' },
    { feature: 'High Transaction Velocity', impact: 0.58, value: '5 txns/hr' },
    { feature: 'Unusual Time', impact: 0.45, value: '2:45 AM' },
    { feature: 'Behaviour Deviation', impact: 0.42, value: '0.78' },
  ],
  suggestedAction: 'Block transaction and require additional verification',
  timestamp: '2024-01-14T18:45:00Z',
}

export const adminStats = {
  totalUsers: 15420,
  activeUsers: 12450,
  totalTransactions: 245000,
  fraudAttempts: 1250,
  fraudBlocked: 1180,
  successRate: 94.4,
  avgResponseTime: '0.8s',
}

export const merchantStats = {
  totalRevenue: 850000,
  todayRevenue: 45000,
  totalOrders: 1250,
  todayOrders: 85,
  avgOrderValue: 680,
  fraudRate: 1.2,
  customerSatisfaction: 4.8,
}
