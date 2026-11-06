// Mock data for Admin Dashboard

export const adminStats = {
  totalUsers: { label: 'Total Users', value: '15,847', trend: '+12.5%', icon: 'Users' },
  totalTransactions: { label: 'Total Transactions', value: '2,45,892', trend: '+8.3%', icon: 'ArrowUpRight' },
  todayTransactions: { label: "Today's Transactions", value: '3,247', trend: '+15.2%', icon: 'Calendar' },
  fraudDetectedToday: { label: 'Fraud Detected Today', value: '47', trend: '-5.1%', icon: 'AlertTriangle' },
  fraudPercentage: { label: 'Fraud Percentage', value: '1.9%', trend: '-0.3%', icon: 'Percent' },
  blockedTransactions: { label: 'Blocked Transactions', value: '89', trend: '+2.4%', icon: 'XCircle' },
  pendingVerification: { label: 'Pending Verification', value: '156', trend: '+8.7%', icon: 'Clock' },
  modelAccuracy: { label: 'Model Accuracy', value: '96.8%', trend: '+0.5%', icon: 'Brain' }
}

export const dailyTransactionsData = [
  { day: 'Mon', transactions: 3200, amount: 4500000 },
  { day: 'Tue', transactions: 3500, amount: 4800000 },
  { day: 'Wed', transactions: 3100, amount: 4200000 },
  { day: 'Thu', transactions: 3800, amount: 5200000 },
  { day: 'Fri', transactions: 4200, amount: 5800000 },
  { day: 'Sat', transactions: 2900, amount: 3900000 },
  { day: 'Sun', transactions: 2400, amount: 3200000 }
]

export const fraudTrendData = [
  { month: 'Jan', fraud: 45, genuine: 4500 },
  { month: 'Feb', fraud: 52, genuine: 4800 },
  { month: 'Mar', fraud: 38, genuine: 5200 },
  { month: 'Apr', fraud: 61, genuine: 5600 },
  { month: 'May', fraud: 47, genuine: 5900 },
  { month: 'Jun', fraud: 55, genuine: 6200 }
]

export const fraudVsGenuineData = [
  { name: 'Genuine', value: 28400, color: '#10b981' },
  { name: 'Fraud', value: 560, color: '#ef4444' }
]

export const fraudByTypeData = [
  { type: 'P2P Transfer', fraud: 180 },
  { type: 'Merchant Payment', fraud: 120 },
  { type: 'Bill Payment', fraud: 95 },
  { type: 'Recharge', fraud: 85 },
  { type: 'QR Payment', fraud: 80 }
]

export const monthlyFraudTrendData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 38 },
  { month: 'Apr', value: 61 },
  { month: 'May', value: 47 },
  { month: 'Jun', value: 55 },
  { month: 'Jul', value: 42 },
  { month: 'Aug', value: 58 },
  { month: 'Sep', value: 51 },
  { month: 'Oct', value: 63 },
  { month: 'Nov', value: 48 },
  { month: 'Dec', value: 57 }
]

export const riskLevelDistributionData = [
  { level: 'LOW', count: 24500, color: '#10b981' },
  { level: 'MEDIUM', count: 3800, color: '#f59e0b' },
  { level: 'HIGH', count: 520, color: '#ef4444' },
  { level: 'CRITICAL', count: 140, color: '#8b5cf6' }
]

export const fraudMonitoringData = [
  { id: 'TXN001', user: 'John Doe', amount: 5000, riskScore: 85, fraudProbability: 92, status: 'Blocked', time: '10:30 AM' },
  { id: 'TXN002', user: 'Jane Smith', amount: 12000, riskScore: 78, fraudProbability: 88, status: 'OTP Required', time: '10:28 AM' },
  { id: 'TXN003', user: 'Mike Johnson', amount: 3500, riskScore: 65, fraudProbability: 72, status: 'Pending', time: '10:25 AM' },
  { id: 'TXN004', user: 'Sarah Wilson', amount: 8000, riskScore: 92, fraudProbability: 95, status: 'Blocked', time: '10:22 AM' },
  { id: 'TXN005', user: 'Tom Brown', amount: 2500, riskScore: 45, fraudProbability: 52, status: 'Approved', time: '10:20 AM' },
  { id: 'TXN006', user: 'Emily Davis', amount: 15000, riskScore: 88, fraudProbability: 91, status: 'OTP Required', time: '10:18 AM' },
  { id: 'TXN007', user: 'Chris Lee', amount: 4200, riskScore: 55, fraudProbability: 58, status: 'Approved', time: '10:15 AM' },
  { id: 'TXN008', user: 'Lisa Anderson', amount: 9000, riskScore: 72, fraudProbability: 78, status: 'Pending', time: '10:12 AM' }
]

export const recentFraudAlerts = [
  { id: 1, type: 'High Risk', message: 'Transaction TXN001 blocked due to high fraud risk', time: '10:30 AM', severity: 'high' },
  { id: 2, type: 'Medium Risk', message: 'Multiple transactions from new device detected', time: '10:25 AM', severity: 'medium' },
  { id: 3, type: 'Blocked', message: 'User account suspended due to suspicious activity', time: '10:20 AM', severity: 'high' },
  { id: 4, type: 'OTP Required', message: 'OTP verification failed for transaction TXN002', time: '10:15 AM', severity: 'medium' },
  { id: 5, type: 'High Risk', message: 'Unusual transaction pattern detected for user', time: '10:10 AM', severity: 'high' }
]

export const liveActivityData = [
  { id: 1, type: 'Transaction', message: 'John Doe sent ₹5,000 to Rahul Sharma', time: '10:30 AM', icon: 'ArrowRight' },
  { id: 2, type: 'Login', message: 'Jane Smith logged in from new device', time: '10:28 AM', icon: 'LogIn' },
  { id: 3, type: 'Fraud', message: 'Fraud detected in transaction TXN001', time: '10:25 AM', icon: 'AlertTriangle' },
  { id: 4, type: 'Success', message: 'Payment of ₹3,500 completed successfully', time: '10:22 AM', icon: 'CheckCircle' },
  { id: 5, type: 'Failed', message: 'Payment failed due to insufficient balance', time: '10:20 AM', icon: 'XCircle' },
  { id: 6, type: 'Transaction', message: 'Mike Johnson received ₹2,000', time: '10:18 AM', icon: 'ArrowDownLeft' },
  { id: 7, type: 'Login', message: 'Sarah Wilson logged in from Mumbai', time: '10:15 AM', icon: 'LogIn' },
  { id: 8, type: 'Success', message: 'Bill payment of ₹1,500 completed', time: '10:12 AM', icon: 'CheckCircle' }
]

export const usersData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', upiId: 'john@okhdfcbank', riskScore: 25, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', upiId: 'jane@okicici', riskScore: 45, status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', upiId: 'mike@oksbi', riskScore: 72, status: 'Suspended' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', upiId: 'sarah@okaxis', riskScore: 15, status: 'Active' },
  { id: 5, name: 'Tom Brown', email: 'tom@example.com', upiId: 'tom@okhdfcbank', riskScore: 38, status: 'Active' },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', upiId: 'emily@okicici', riskScore: 85, status: 'Suspended' },
  { id: 7, name: 'Chris Lee', email: 'chris@example.com', upiId: 'chris@oksbi', riskScore: 22, status: 'Active' },
  { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', upiId: 'lisa@okaxis', riskScore: 55, status: 'Active' }
]

export const transactionsData = [
  { id: 'TXN001', sender: 'John Doe', receiver: 'Rahul Sharma', amount: 5000, status: 'Completed', fraud: false, date: '2024-01-15' },
  { id: 'TXN002', sender: 'Jane Smith', receiver: 'Priya Patel', amount: 12000, status: 'Blocked', fraud: true, date: '2024-01-15' },
  { id: 'TXN003', sender: 'Mike Johnson', receiver: 'Amit Kumar', amount: 3500, status: 'Pending', fraud: false, date: '2024-01-14' },
  { id: 'TXN004', sender: 'Sarah Wilson', receiver: 'Sneha Reddy', amount: 8000, status: 'Completed', fraud: false, date: '2024-01-14' },
  { id: 'TXN005', sender: 'Tom Brown', receiver: 'Vikram Singh', amount: 2500, status: 'Completed', fraud: false, date: '2024-01-13' },
  { id: 'TXN006', sender: 'Emily Davis', receiver: 'Neha Gupta', amount: 15000, status: 'Blocked', fraud: true, date: '2024-01-13' },
  { id: 'TXN007', sender: 'Chris Lee', receiver: 'Raj Malhotra', amount: 4200, status: 'Completed', fraud: false, date: '2024-01-12' },
  { id: 'TXN008', sender: 'Lisa Anderson', receiver: 'Anil Sharma', amount: 9000, status: 'Pending', fraud: false, date: '2024-01-12' }
]

export const mlPerformanceData = {
  currentModel: 'XGBoost v2.4.1',
  accuracy: 96.8,
  precision: 94.5,
  recall: 92.3,
  f1Score: 93.4,
  rocAuc: 97.2,
  predictionCount: 28450,
  todayPredictions: 3247,
  avgPredictionTime: '0.8s',
  modelVersion: 'v2.4.1'
}

export const featureImportanceData = [
  { feature: 'Customer Behaviour Deviation', importance: 0.32, color: '#ef4444' },
  { feature: 'Transaction Velocity', importance: 0.24, color: '#f59e0b' },
  { feature: 'Device Changed', importance: 0.18, color: '#10b981' },
  { feature: 'Location Changed', importance: 0.12, color: '#3b82f6' },
  { feature: 'New Beneficiary', importance: 0.08, color: '#8b5cf6' },
  { feature: 'Amount', importance: 0.06, color: '#ec4899' }
]

export const fraudHeatmapData = [
  { hour: '00-04', mon: 2, tue: 3, wed: 1, thu: 2, fri: 4, sat: 5, sun: 3 },
  { hour: '04-08', mon: 5, tue: 4, wed: 6, thu: 3, fri: 5, sat: 8, sun: 6 },
  { hour: '08-12', mon: 12, tue: 15, wed: 10, thu: 14, fri: 18, sat: 20, sun: 12 },
  { hour: '12-16', mon: 18, tue: 20, wed: 16, thu: 22, fri: 25, sat: 28, sun: 18 },
  { hour: '16-20', mon: 22, tue: 25, wed: 20, thu: 28, fri: 32, sat: 35, sun: 22 },
  { hour: '20-24', mon: 15, tue: 18, wed: 12, thu: 16, fri: 20, sat: 22, sun: 15 }
]

export const notificationsData = [
  { id: 1, type: 'High Risk', message: 'High risk transaction detected for user John Doe', time: '10:30 AM', read: false },
  { id: 2, type: 'New User', message: 'New user registered: Jane Smith', time: '10:25 AM', read: false },
  { id: 3, type: 'Model Update', message: 'ML model updated to version v2.4.1', time: '10:20 AM', read: true },
  { id: 4, type: 'OTP Failed', message: 'OTP verification failed for transaction TXN002', time: '10:15 AM', read: false },
  { id: 5, type: 'System', message: 'System maintenance scheduled for tonight', time: '10:10 AM', read: true }
]

export const adminSidebarItems = [
  { id: 1, label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin' },
  { id: 2, label: 'Users', icon: 'Users', path: '/admin/users' },
  { id: 3, label: 'Transactions', icon: 'ArrowRightLeft', path: '/admin/transactions' },
  { id: 4, label: 'Fraud Monitoring', icon: 'ShieldAlert', path: '/admin/fraud' },
  { id: 5, label: 'Analytics', icon: 'BarChart3', path: '/admin/analytics' },
  { id: 6, label: 'ML Performance', icon: 'Brain', path: '/admin/ml' },
  { id: 7, label: 'Reports', icon: 'FileText', path: '/admin/reports' },
  { id: 8, label: 'Notifications', icon: 'Bell', path: '/admin/notifications' },
  { id: 9, label: 'Settings', icon: 'Settings', path: '/admin/settings' }
]
