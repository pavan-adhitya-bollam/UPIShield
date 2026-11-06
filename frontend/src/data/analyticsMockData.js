export const behavioralAnalytics = [
  {
    id: 'customer-behaviour-deviation',
    title: 'Customer Behaviour Deviation',
    value: 'Moderate',
    description: 'Deviation from usual spending and transfer patterns.',
    note: 'Mock value until backend analytics is available.'
  },
  {
    id: 'device-changed',
    title: 'Device Changed',
    value: '14%',
    description: 'Transactions from new or unknown devices.',
    note: 'Mock indicator based on fraud analysis patterns.'
  },
  {
    id: 'location-changed',
    title: 'Location Changed',
    value: '9%',
    description: 'Transactions from unexpected geolocations.',
    note: 'Mock indicator based on model feature signals.'
  },
  {
    id: 'new-beneficiary',
    title: 'New Beneficiary',
    value: '7%',
    description: 'Payments to beneficiaries with no prior transaction history.',
    note: 'Demo value for UPI risk scoring.'
  },
  {
    id: 'recent-velocity',
    title: 'Transactions Last 10 Minutes',
    value: '5',
    description: 'High-frequency transactions in a short time window.',
    note: 'Behavioral indicator from sample analytics.'
  },
  {
    id: 'hour-velocity',
    title: 'Transactions Last Hour',
    value: '18',
    description: 'Transactions within the last hour.',
    note: 'Mock value to support live-style analytics.'
  },
  {
    id: 'daily-velocity',
    title: 'Transactions Last 24 Hours',
    value: '72',
    description: 'Total transactions in the past day.',
    note: 'Approximate analytics indicator.'
  },
  {
    id: 'amount-last-24h',
    title: 'Amount Sent Last 24 Hours',
    value: '₹8.2L',
    description: 'Cumulative volume processed in the last day.',
    note: 'Mock value for visualization.'
  },
  {
    id: 'received-last-24h',
    title: 'Amount Received Last 24 Hours',
    value: '₹6.4L',
    description: 'Incoming volume in the last day.',
    note: 'Demo analytics metric.'
  },
  {
    id: 'unique-receivers',
    title: 'Unique Receivers Today',
    value: '32',
    description: 'New receiving UPI IDs seen today.',
    note: 'Mock indicator for risk and behavior.'
  }
]

export const topRiskIndicators = [
  {
    id: 'new-beneficiary',
    title: 'New Beneficiary',
    rank: 1,
    detail: 'New recipients with limited or no historical activity.'
  },
  {
    id: 'device-change',
    title: 'Device Changed',
    rank: 2,
    detail: 'Session initiated from a device that is not recognised.'
  },
  {
    id: 'location-change',
    title: 'Location Changed',
    rank: 3,
    detail: 'Transaction location differs significantly from baseline.'
  },
  {
    id: 'velocity-spike',
    title: 'High Transaction Velocity',
    rank: 4,
    detail: 'Multiple transactions within a short time frame.'
  },
  {
    id: 'large-sent',
    title: 'Large Transaction Amount',
    rank: 5,
    detail: 'Amount exceeds normal average for the user.'
  }
]

export const locationAnalytics = {
  topLocations: [
    { name: 'Mumbai', transactions: 5480, fraudRate: '1.2%' },
    { name: 'Bengaluru', transactions: 4320, fraudRate: '1.6%' },
    { name: 'Delhi', transactions: 3920, fraudRate: '1.4%' },
    { name: 'Chennai', transactions: 2840, fraudRate: '0.9%' },
    { name: 'Pune', transactions: 1760, fraudRate: '1.8%' }
  ],
  topFraudLocations: [
    { name: 'Bengaluru', fraudTransactions: 62, fraudRate: '1.6%' },
    { name: 'Pune', fraudTransactions: 45, fraudRate: '1.8%' },
    { name: 'Mumbai', fraudTransactions: 52, fraudRate: '1.2%' },
    { name: 'Delhi', fraudTransactions: 48, fraudRate: '1.4%' },
    { name: 'Hyderabad', fraudTransactions: 19, fraudRate: '1.5%' }
  ],
  fraudRateByLocation: [
    { location: 'Pune', fraudRate: 1.8 },
    { location: 'Bengaluru', fraudRate: 1.6 },
    { location: 'Delhi', fraudRate: 1.4 },
    { location: 'Mumbai', fraudRate: 1.2 },
    { location: 'Chennai', fraudRate: 0.9 }
  ]
}

export const timeAnalysisData = {
  fraudByHour: [
    { period: '12 AM - 5 AM', fraud: 5, transactions: 98 },
    { period: '5 AM - 12 PM', fraud: 18, transactions: 420 },
    { period: '12 PM - 6 PM', fraud: 32, transactions: 560 },
    { period: '6 PM - 12 AM', fraud: 27, transactions: 490 }
  ],
  fraudByDayOfWeek: [
    { day: 'Mon', fraud: 12 },
    { day: 'Tue', fraud: 18 },
    { day: 'Wed', fraud: 15 },
    { day: 'Thu', fraud: 22 },
    { day: 'Fri', fraud: 24 },
    { day: 'Sat', fraud: 17 },
    { day: 'Sun', fraud: 11 }
  ],
  fraudByMonth: [
    { month: 'Jan', fraud: 45 },
    { month: 'Feb', fraud: 52 },
    { month: 'Mar', fraud: 38 },
    { month: 'Apr', fraud: 61 },
    { month: 'May', fraud: 47 },
    { month: 'Jun', fraud: 55 }
  ]
}

export const notificationFilters = [
  { id: 'all', label: 'All' },
  { id: 'transaction', label: 'Transaction' },
  { id: 'fraud-alert', label: 'Fraud Alerts' },
  { id: 'security', label: 'Security' },
  { id: 'login', label: 'Login' },
  { id: 'system', label: 'System' },
  { id: 'promotion', label: 'Promotion' }
]
