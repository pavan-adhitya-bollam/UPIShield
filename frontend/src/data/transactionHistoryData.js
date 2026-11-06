// Mock data for Transaction History module

export const transactionStats = {
  totalTransactions: { label: 'Total Transactions', value: '2,45,892', trend: '+12.5%', icon: 'ArrowUpRight' },
  todayTransactions: { label: "Today's Transactions", value: '3,247', trend: '+8.3%', icon: 'Calendar' },
  successfulPayments: { label: 'Successful Payments', value: '2,38,450', trend: '+15.2%', icon: 'CheckCircle' },
  failedPayments: { label: 'Failed Payments', value: '7,442', trend: '-3.1%', icon: 'XCircle' },
  fraudulentTransactions: { label: 'Fraudulent Transactions', value: '560', trend: '-5.4%', icon: 'AlertTriangle' },
  totalAmountSent: { label: 'Total Amount Sent', value: '₹45.2L', trend: '+18.7%', icon: 'ArrowUp' },
  totalAmountReceived: { label: 'Total Amount Received', value: '₹32.8L', trend: '+14.2%', icon: 'ArrowDown' },
  averageTransactionAmount: { label: 'Average Transaction', value: '₹1,847', trend: '+2.3%', icon: 'TrendingUp' }
}

export const transactionsData = [
  {
    id: 'TXN001234567',
    sender: 'John Doe',
    senderUpi: 'john@okhdfcbank',
    receiver: 'Rahul Sharma',
    receiverUpi: 'rahul@okicici',
    amount: 5000,
    transactionType: 'P2P Transfer',
    date: '2024-01-15',
    time: '10:30 AM',
    status: 'Completed',
    riskLevel: 'LOW',
    fraudProbability: 5,
    paymentStatus: 'Success',
    referenceNumber: 'REF123456789',
    purpose: 'Personal',
    merchantCategory: null,
    paymentMethod: 'UPI',
    location: 'Mumbai',
    device: 'iPhone 14',
    confidenceScore: 98.5
  },
  {
    id: 'TXN001234568',
    sender: 'Jane Smith',
    senderUpi: 'jane@oksbi',
    receiver: 'Amazon India',
    receiverUpi: 'amazon@paytm',
    amount: 12500,
    transactionType: 'Merchant Payment',
    date: '2024-01-15',
    time: '10:25 AM',
    status: 'Completed',
    riskLevel: 'MEDIUM',
    fraudProbability: 25,
    paymentStatus: 'Success',
    referenceNumber: 'REF123456790',
    purpose: 'Shopping',
    merchantCategory: 'E-commerce',
    paymentMethod: 'UPI',
    location: 'Delhi',
    device: 'Samsung Galaxy S23',
    confidenceScore: 92.3
  },
  {
    id: 'TXN001234569',
    sender: 'Mike Johnson',
    senderUpi: 'mike@okaxis',
    receiver: 'Unknown User',
    receiverUpi: 'unknown@okhdfcbank',
    amount: 45000,
    transactionType: 'P2P Transfer',
    date: '2024-01-15',
    time: '10:20 AM',
    status: 'Blocked',
    riskLevel: 'HIGH',
    fraudProbability: 85,
    paymentStatus: 'Failed',
    referenceNumber: 'REF123456791',
    purpose: 'Personal',
    merchantCategory: null,
    paymentMethod: 'UPI',
    location: 'Bangalore',
    device: 'OnePlus 11',
    confidenceScore: 95.2
  },
  {
    id: 'TXN001234570',
    sender: 'Sarah Wilson',
    senderUpi: 'sarah@okicici',
    receiver: 'Flipkart',
    receiverUpi: 'flipkart@paytm',
    amount: 8500,
    transactionType: 'Merchant Payment',
    date: '2024-01-14',
    time: '09:45 PM',
    status: 'Completed',
    riskLevel: 'LOW',
    fraudProbability: 8,
    paymentStatus: 'Success',
    referenceNumber: 'REF123456792',
    purpose: 'Shopping',
    merchantCategory: 'E-commerce',
    paymentMethod: 'UPI',
    location: 'Chennai',
    device: 'iPhone 13',
    confidenceScore: 97.8
  },
  {
    id: 'TXN001234571',
    sender: 'Tom Brown',
    senderUpi: 'tom@oksbi',
    receiver: 'Electricity Board',
    receiverUpi: 'electricity@paytm',
    amount: 2500,
    transactionType: 'Bill Payment',
    date: '2024-01-14',
    time: '08:30 PM',
    status: 'Completed',
    riskLevel: 'LOW',
    fraudProbability: 3,
    paymentStatus: 'Success',
    referenceNumber: 'REF123456793',
    purpose: 'Bill Payment',
    merchantCategory: 'Utilities',
    paymentMethod: 'UPI',
    location: 'Hyderabad',
    device: 'Google Pixel 7',
    confidenceScore: 99.1
  },
  {
    id: 'TXN001234572',
    sender: 'Emily Davis',
    senderUpi: 'emily@okaxis',
    receiver: 'New Beneficiary',
    receiverUpi: 'new@okhdfcbank',
    amount: 25000,
    transactionType: 'P2P Transfer',
    date: '2024-01-14',
    time: '07:15 PM',
    status: 'Pending',
    riskLevel: 'MEDIUM',
    fraudProbability: 45,
    paymentStatus: 'Pending',
    referenceNumber: 'REF123456794',
    purpose: 'Personal',
    merchantCategory: null,
    paymentMethod: 'UPI',
    location: 'Pune',
    device: 'iPhone 15',
    confidenceScore: 88.7
  },
  {
    id: 'TXN001234573',
    sender: 'Chris Lee',
    senderUpi: 'chris@okicici',
    receiver: 'Netflix',
    receiverUpi: 'netflix@paytm',
    amount: 649,
    transactionType: 'Subscription',
    date: '2024-01-13',
    time: '11:00 AM',
    status: 'Completed',
    riskLevel: 'LOW',
    fraudProbability: 2,
    paymentStatus: 'Success',
    referenceNumber: 'REF123456795',
    purpose: 'Entertainment',
    merchantCategory: 'Entertainment',
    paymentMethod: 'UPI',
    location: 'Mumbai',
    device: 'MacBook',
    confidenceScore: 99.5
  },
  {
    id: 'TXN001234574',
    sender: 'Lisa Anderson',
    senderUpi: 'lisa@oksbi',
    receiver: 'Suspicious Account',
    receiverUpi: 'suspicious@okaxis',
    amount: 75000,
    transactionType: 'P2P Transfer',
    date: '2024-01-13',
    time: '09:30 AM',
    status: 'Blocked',
    riskLevel: 'CRITICAL',
    fraudProbability: 92,
    paymentStatus: 'Failed',
    referenceNumber: 'REF123456796',
    purpose: 'Personal',
    merchantCategory: null,
    paymentMethod: 'UPI',
    location: 'Unknown',
    device: 'Unknown Device',
    confidenceScore: 96.8
  },
  {
    id: 'TXN001234575',
    sender: 'David Miller',
    senderUpi: 'david@okhdfcbank',
    receiver: 'Swiggy',
    receiverUpi: 'swiggy@paytm',
    amount: 850,
    transactionType: 'Merchant Payment',
    date: '2024-01-12',
    time: '08:00 PM',
    status: 'Completed',
    riskLevel: 'LOW',
    fraudProbability: 4,
    paymentStatus: 'Success',
    referenceNumber: 'REF123456797',
    purpose: 'Food',
    merchantCategory: 'Food Delivery',
    paymentMethod: 'UPI',
    location: 'Bangalore',
    device: 'iPhone 14 Pro',
    confidenceScore: 98.9
  },
  {
    id: 'TXN001234576',
    sender: 'Emma Wilson',
    senderUpi: 'emma@okicici',
    receiver: 'Zomato',
    receiverUpi: 'zomato@paytm',
    amount: 1200,
    transactionType: 'Merchant Payment',
    date: '2024-01-12',
    time: '07:45 PM',
    status: 'Completed',
    riskLevel: 'LOW',
    fraudProbability: 5,
    paymentStatus: 'Success',
    referenceNumber: 'REF123456798',
    purpose: 'Food',
    merchantCategory: 'Food Delivery',
    paymentMethod: 'UPI',
    location: 'Delhi',
    device: 'Samsung Galaxy S24',
    confidenceScore: 98.2
  }
]

export const dailyTransactionsData = [
  { day: 'Mon', transactions: 3200, amount: 4500000 },
  { day: 'Tue', transactions: 3500, amount: 4800000 },
  { day: 'Wed', transactions: 3100, amount: 4200000 },
  { day: 'Thu', transactions: 3800, amount: 5200000 },
  { day: 'Fri', transactions: 4200, amount: 5800000 },
  { day: 'Sat', transactions: 2900, amount: 3900000 },
  { day: 'Sun', transactions: 2400, amount: 3200000 }
]

export const monthlySpendingData = [
  { month: 'Jan', spending: 450000 },
  { month: 'Feb', spending: 520000 },
  { month: 'Mar', spending: 480000 },
  { month: 'Apr', spending: 580000 },
  { month: 'May', spending: 620000 },
  { month: 'Jun', spending: 550000 }
]

export const transactionCategoriesData = [
  { category: 'P2P Transfer', count: 8500, amount: 15000000 },
  { category: 'Merchant Payment', count: 12000, amount: 25000000 },
  { category: 'Bill Payment', count: 4500, amount: 8000000 },
  { category: 'Subscription', count: 2800, amount: 500000 },
  { category: 'Recharge', count: 3500, amount: 2000000 }
]

export const riskDistributionData = [
  { level: 'LOW', count: 24500, color: '#10b981' },
  { level: 'MEDIUM', count: 3800, color: '#f59e0b' },
  { level: 'HIGH', count: 520, color: '#ef4444' },
  { level: 'CRITICAL', count: 140, color: '#8b5cf6' }
]

export const fraudTrendData = [
  { month: 'Jan', fraud: 45, genuine: 4500 },
  { month: 'Feb', fraud: 52, genuine: 4800 },
  { month: 'Mar', fraud: 38, genuine: 5200 },
  { month: 'Apr', fraud: 61, genuine: 5600 },
  { month: 'May', fraud: 47, genuine: 5900 },
  { month: 'Jun', fraud: 55, genuine: 6200 }
]

export const successVsFailedData = [
  { name: 'Success', value: 238450, color: '#10b981' },
  { name: 'Failed', value: 7442, color: '#ef4444' }
]

export const fraudAnalysisReasons = [
  {
    feature: 'Device Changed',
    riskWeight: 0.25,
    explanation: 'Transaction initiated from a new device not previously associated with the account'
  },
  {
    feature: 'New Beneficiary',
    riskWeight: 0.30,
    explanation: 'Payment sent to a beneficiary with no prior transaction history'
  },
  {
    feature: 'High Transaction Velocity',
    riskWeight: 0.20,
    explanation: 'Multiple transactions initiated within a short time window'
  },
  {
    feature: 'Customer Behaviour Deviation',
    riskWeight: 0.15,
    explanation: 'Transaction pattern deviates significantly from user\'s normal behavior'
  },
  {
    feature: 'Location Changed',
    riskWeight: 0.18,
    explanation: 'Transaction initiated from an unusual geographic location'
  },
  {
    feature: 'Large Amount',
    riskWeight: 0.12,
    explanation: 'Transaction amount exceeds user\'s typical transaction range'
  }
]

export const transactionTimelineData = [
  { step: 'Transaction Created', status: 'completed', time: '10:30 AM', description: 'Transaction initiated by user' },
  { step: 'Fraud Analysis', status: 'completed', time: '10:30 AM', description: 'AI fraud detection analysis performed' },
  { step: 'OTP Verification', status: 'completed', time: '10:31 AM', description: 'User verified with OTP' },
  { step: 'Payment Processing', status: 'completed', time: '10:32 AM', description: 'Payment processed by bank' },
  { step: 'Payment Success', status: 'completed', time: '10:33 AM', description: 'Transaction completed successfully' }
]

export const filterOptions = {
  transactionTypes: ['All', 'P2P Transfer', 'Merchant Payment', 'Bill Payment', 'Subscription', 'Recharge'],
  statuses: ['All', 'Completed', 'Pending', 'Blocked', 'Failed'],
  riskLevels: ['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  merchantCategories: ['All', 'E-commerce', 'Food Delivery', 'Utilities', 'Entertainment', 'Travel', 'Healthcare'],
  paymentMethods: ['All', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'],
  sortOptions: [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highestAmount', label: 'Highest Amount' },
    { value: 'lowestAmount', label: 'Lowest Amount' },
    { value: 'highestRisk', label: 'Highest Risk' }
  ]
}
