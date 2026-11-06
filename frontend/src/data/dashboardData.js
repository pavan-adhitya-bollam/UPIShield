// Mock data for User Dashboard

export const statsData = {
  totalTransactions: {
    value: '1,247',
    label: 'Total Transactions',
    trend: { value: 12, positive: true },
    icon: 'ArrowUpRight'
  },
  todayTransactions: {
    value: '23',
    label: "Today's Transactions",
    trend: { value: 8, positive: true },
    icon: 'Calendar'
  },
  monthlySpending: {
    value: '₹45,230',
    label: 'Monthly Spending',
    trend: { value: 5, positive: false },
    icon: 'IndianRupee'
  },
  fraudAlerts: {
    value: '3',
    label: 'Fraud Alerts',
    trend: { value: 2, positive: false },
    icon: 'AlertTriangle'
  },
  safeTransactions: {
    value: '1,244',
    label: 'Safe Transactions',
    trend: { value: 15, positive: true },
    icon: 'CheckCircle'
  }
}

export const monthlyTransactionData = [
  { month: 'Jan', transactions: 65, amount: 12000 },
  { month: 'Feb', transactions: 78, amount: 15000 },
  { month: 'Mar', transactions: 92, amount: 18000 },
  { month: 'Apr', transactions: 85, amount: 16500 },
  { month: 'May', transactions: 110, amount: 22000 },
  { month: 'Jun', transactions: 125, amount: 25000 },
  { month: 'Jul', transactions: 98, amount: 19500 },
  { month: 'Aug', transactions: 105, amount: 21000 },
  { month: 'Sep', transactions: 115, amount: 23000 },
  { month: 'Oct', transactions: 130, amount: 26000 },
  { month: 'Nov', transactions: 145, amount: 29000 },
  { month: 'Dec', transactions: 160, amount: 32000 }
]

export const fraudVsGenuineData = [
  { name: 'Genuine', value: 1244, color: '#10b981' },
  { name: 'Suspicious', value: 2, color: '#f59e0b' },
  { name: 'Fraudulent', value: 1, color: '#ef4444' }
]

export const spendingCategoriesData = [
  { category: 'Shopping', amount: 15000 },
  { category: 'Food & Dining', amount: 8500 },
  { category: 'Bills & Utilities', amount: 12000 },
  { category: 'Transport', amount: 4500 },
  { category: 'Entertainment', amount: 3200 },
  { category: 'Healthcare', amount: 2800 },
  { category: 'Others', amount: 2230 }
]

export const hourlyTransactionData = [
  { hour: '00:00', transactions: 2 },
  { hour: '02:00', transactions: 1 },
  { hour: '04:00', transactions: 0 },
  { hour: '06:00', transactions: 3 },
  { hour: '08:00', transactions: 12 },
  { hour: '10:00', transactions: 18 },
  { hour: '12:00', transactions: 15 },
  { hour: '14:00', transactions: 22 },
  { hour: '16:00', transactions: 25 },
  { hour: '18:00', transactions: 20 },
  { hour: '20:00', transactions: 16 },
  { hour: '22:00', transactions: 8 }
]

export const recentTransactions = [
  {
    id: 'TXN001',
    receiver: 'Amazon Pay',
    amount: 2499,
    date: '2024-01-15',
    time: '14:32',
    status: 'Completed',
    riskScore: 5,
    category: 'Shopping'
  },
  {
    id: 'TXN002',
    receiver: 'Swiggy',
    amount: 450,
    date: '2024-01-15',
    time: '13:15',
    status: 'Completed',
    riskScore: 3,
    category: 'Food'
  },
  {
    id: 'TXN003',
    receiver: 'Unknown User',
    amount: 5000,
    date: '2024-01-15',
    time: '11:45',
    status: 'Flagged',
    riskScore: 85,
    category: 'Transfer'
  },
  {
    id: 'TXN004',
    receiver: 'Electricity Board',
    amount: 1850,
    date: '2024-01-14',
    time: '10:20',
    status: 'Completed',
    riskScore: 2,
    category: 'Bills'
  },
  {
    id: 'TXN005',
    receiver: 'Uber',
    amount: 320,
    date: '2024-01-14',
    time: '09:30',
    status: 'Completed',
    riskScore: 4,
    category: 'Transport'
  },
  {
    id: 'TXN006',
    receiver: 'Netflix',
    amount: 649,
    date: '2024-01-13',
    time: '08:00',
    status: 'Completed',
    riskScore: 1,
    category: 'Entertainment'
  },
  {
    id: 'TXN007',
    receiver: 'Pharmacy',
    amount: 890,
    date: '2024-01-13',
    time: '16:45',
    status: 'Completed',
    riskScore: 3,
    category: 'Healthcare'
  },
  {
    id: 'TXN008',
    receiver: 'Suspicious Account',
    amount: 10000,
    date: '2024-01-12',
    time: '15:20',
    status: 'Blocked',
    riskScore: 95,
    category: 'Transfer'
  }
]

export const fraudAlerts = [
  {
    id: 1,
    riskLevel: 'HIGH',
    probability: 95,
    transactionId: 'TXN008',
    suggestedAction: 'Block & Report',
    time: '2 hours ago'
  },
  {
    id: 2,
    riskLevel: 'MEDIUM',
    probability: 85,
    transactionId: 'TXN003',
    suggestedAction: 'Review & Verify',
    time: '5 hours ago'
  },
  {
    id: 3,
    riskLevel: 'LOW',
    probability: 45,
    transactionId: 'TXN012',
    suggestedAction: 'Monitor',
    time: '1 day ago'
  }
]

export const notifications = [
  {
    id: 1,
    type: 'fraud',
    title: 'Fraud Alert',
    message: 'Suspicious transaction detected from unknown user',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Payment Successful',
    message: '₹2,499 paid to Amazon Pay',
    time: '3 hours ago',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Low Balance',
    message: 'Your account balance is below ₹5,000',
    time: '5 hours ago',
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'Monthly Report',
    message: 'Your monthly spending report is ready',
    time: '1 day ago',
    read: true
  },
  {
    id: 5,
    type: 'success',
    title: 'UPI Link Added',
    message: 'Successfully linked your bank account',
    time: '2 days ago',
    read: true
  }
]

export const quickActions = [
  {
    id: 1,
    title: 'Send Money',
    icon: 'Send',
    route: '/send-money',
    color: 'primary'
  },
  {
    id: 2,
    title: 'View Profile',
    icon: 'User',
    route: '/profile',
    color: 'accent'
  },
  {
    id: 3,
    title: 'View History',
    icon: 'History',
    route: '/transactions',
    color: 'green'
  },
  {
    id: 4,
    title: 'Detect Fraud',
    icon: 'Shield',
    route: '/fraud-detection',
    color: 'red'
  },
  {
    id: 5,
    title: 'Download Report',
    icon: 'Download',
    route: '/reports',
    color: 'blue'
  }
]
