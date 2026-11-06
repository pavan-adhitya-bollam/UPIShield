// Mock data for Settings & Security Center module

export const profileData = {
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+91 98765 43210',
  upiId: 'john@okhdfcbank',
  bankName: 'HDFC Bank',
  accountNumber: 'XXXX XXXX XXXX 4521',
  memberSince: 'January 15, 2023',
  kycStatus: 'Verified',
  kycVerifiedDate: 'February 20, 2023'
}

export const securityData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: true,
  transactionPin: '1234',
  biometricLogin: {
    enabled: true,
    faceId: true,
    fingerprint: true
  },
  autoLogoutTime: '30',
  securityScore: 92,
  securityLevel: 'Strong Security'
}

export const connectedDevices = [
  {
    id: 1,
    deviceName: 'iPhone 14 Pro',
    deviceType: 'Mobile',
    browser: 'Safari',
    operatingSystem: 'iOS 17.2',
    location: 'Mumbai, India',
    lastActive: '2 minutes ago',
    status: 'Current Device',
    isCurrent: true
  },
  {
    id: 2,
    deviceName: 'MacBook Pro M2',
    deviceType: 'Laptop',
    browser: 'Chrome',
    operatingSystem: 'macOS Sonoma',
    location: 'Mumbai, India',
    lastActive: '1 hour ago',
    status: 'Active',
    isCurrent: false
  },
  {
    id: 3,
    deviceName: 'Samsung Galaxy S23',
    deviceType: 'Mobile',
    browser: 'Chrome',
    operatingSystem: 'Android 14',
    location: 'Delhi, India',
    lastActive: '3 days ago',
    status: 'Active',
    isCurrent: false
  },
  {
    id: 4,
    deviceName: 'Windows PC',
    deviceType: 'Desktop',
    browser: 'Edge',
    operatingSystem: 'Windows 11',
    location: 'Bangalore, India',
    lastActive: '1 week ago',
    status: 'Inactive',
    isCurrent: false
  }
]

export const loginHistory = [
  {
    id: 1,
    date: '2024-01-15',
    time: '10:30 AM',
    device: 'iPhone 14 Pro',
    browser: 'Safari',
    location: 'Mumbai, India',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: 2,
    date: '2024-01-15',
    time: '09:15 AM',
    device: 'MacBook Pro M2',
    browser: 'Chrome',
    location: 'Mumbai, India',
    ipAddress: '192.168.1.101',
    status: 'Success'
  },
  {
    id: 3,
    date: '2024-01-14',
    time: '11:45 PM',
    device: 'iPhone 14 Pro',
    browser: 'Safari',
    location: 'Mumbai, India',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: 4,
    date: '2024-01-14',
    time: '08:30 PM',
    device: 'Samsung Galaxy S23',
    browser: 'Chrome',
    location: 'Delhi, India',
    ipAddress: '192.168.1.102',
    status: 'Success'
  },
  {
    id: 5,
    date: '2024-01-13',
    time: '03:20 PM',
    device: 'Unknown Device',
    browser: 'Chrome',
    location: 'Unknown Location',
    ipAddress: '203.0.113.45',
    status: 'Failed'
  },
  {
    id: 6,
    date: '2024-01-12',
    time: '10:00 AM',
    device: 'Windows PC',
    browser: 'Edge',
    location: 'Bangalore, India',
    ipAddress: '192.168.1.103',
    status: 'Success'
  },
  {
    id: 7,
    date: '2024-01-11',
    time: '02:15 PM',
    device: 'iPhone 14 Pro',
    browser: 'Safari',
    location: 'Mumbai, India',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: 8,
    date: '2024-01-10',
    time: '11:30 AM',
    device: 'MacBook Pro M2',
    browser: 'Chrome',
    location: 'Mumbai, India',
    ipAddress: '192.168.1.101',
    status: 'Success'
  }
]

export const notificationSettings = {
  transactionAlerts: {
    enabled: true,
    email: true,
    sms: true,
    push: true
  },
  fraudAlerts: {
    enabled: true,
    email: true,
    sms: true,
    push: true
  },
  loginAlerts: {
    enabled: true,
    email: true,
    sms: false,
    push: true
  },
  weeklyReports: {
    enabled: true,
    email: true
  },
  monthlyReports: {
    enabled: true,
    email: true
  }
}

export const appearanceSettings = {
  darkMode: true,
  themeColor: 'purple',
  accentColor: 'blue',
  fontSize: 'medium',
  compactView: false,
  animations: true
}

export const transactionSettings = {
  dailyLimit: 100000,
  monthlyLimit: 5000000,
  upiLimit: 200000,
  requireOtpAbove: 50000,
  preferredBank: 'HDFC Bank',
  defaultPaymentApp: 'UPI',
  autoSaveBeneficiary: true
}

export const privacySettings = {
  dataSharing: false,
  analyticsCollection: true,
  locationPermission: true,
  personalizedRecommendations: true
}

export const faqData = [
  {
    id: 1,
    question: 'How do I change my transaction PIN?',
    answer: 'Go to Settings > Security > Transaction PIN. Enter your current PIN and set a new 4-digit PIN. You will receive an OTP to verify the change.'
  },
  {
    id: 2,
    question: 'What is Two-Factor Authentication (2FA)?',
    answer: 'Two-Factor Authentication adds an extra layer of security by requiring both your password and a verification code sent to your registered mobile number or email.'
  },
  {
    id: 3,
    question: 'How can I view my connected devices?',
    answer: 'Navigate to Settings > Connected Devices to view all devices currently logged into your account. You can remove any device from this list.'
  },
  {
    id: 4,
    question: 'How do I enable biometric login?',
    answer: 'Go to Settings > Security > Biometric Login. Toggle the switch to enable Face ID or fingerprint authentication for quick and secure login.'
  },
  {
    id: 5,
    question: 'What happens when I delete my account?',
    answer: 'Account deletion is permanent. All your data, transaction history, and linked bank accounts will be permanently removed. You can create a new account but will need to complete KYC again.'
  },
  {
    id: 6,
    question: 'How do I set transaction limits?',
    answer: 'Visit Settings > Transaction Preferences to set your daily, monthly, and per-transaction limits. These limits help protect you from unauthorized transactions.'
  },
  {
    id: 7,
    question: 'Can I download my personal data?',
    answer: 'Yes, go to Settings > Privacy > Download Personal Data. Your data will be compiled and sent to your registered email within 24 hours.'
  },
  {
    id: 8,
    question: 'How do I report a fraudulent transaction?',
    answer: 'If you notice any unauthorized transaction, immediately contact our support team through Settings > Help & Support > Report Issue or call our 24/7 helpline.'
  }
]

export const aboutSystemData = {
  applicationVersion: '2.5.1',
  frontendVersion: '1.0.0',
  machineLearningModel: 'XGBoost',
  datasetVersion: 'Behavioral V2',
  lastModelTrainingDate: 'January 10, 2024',
  predictionThreshold: 0.65,
  developerInfo: {
    team: 'UPI Fraud Detection Team',
    contact: 'support@upifraud.com',
    website: 'www.upifraud.com'
  },
  projectName: 'Intelligent UPI Risk Assessment and Fraud Detection System',
  description: 'An advanced AI-powered system for real-time fraud detection in UPI transactions using machine learning and behavioral analysis.',
  features: [
    'Real-time fraud detection',
    'Behavioral analysis',
    'Risk assessment',
    'Multi-factor authentication',
    'Transaction monitoring',
    'Advanced analytics',
    'Device management',
    'Security alerts'
  ]
}

export const sidebarSections = [
  { id: 'profile', label: 'Profile', icon: 'User' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  { id: 'appearance', label: 'Appearance', icon: 'Palette' },
  { id: 'transaction', label: 'Transaction Preferences', icon: 'CreditCard' },
  { id: 'privacy', label: 'Privacy', icon: 'Lock' },
  { id: 'devices', label: 'Connected Devices', icon: 'Smartphone' },
  { id: 'loginHistory', label: 'Login History', icon: 'History' },
  { id: 'help', label: 'Help & Support', icon: 'HelpCircle' },
  { id: 'about', label: 'About System', icon: 'Info' }
]

export const themeColors = [
  { id: 'purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'green', name: 'Green', color: '#10b981' },
  { id: 'red', name: 'Red', color: '#ef4444' },
  { id: 'orange', name: 'Orange', color: '#f97316' }
]

export const fontSizes = [
  { id: 'small', name: 'Small', size: '14px' },
  { id: 'medium', name: 'Medium', size: '16px' },
  { id: 'large', name: 'Large', size: '18px' },
  { id: 'xlarge', name: 'Extra Large', size: '20px' }
]

export const autoLogoutOptions = [
  { id: '5', label: '5 minutes' },
  { id: '15', label: '15 minutes' },
  { id: '30', label: '30 minutes' },
  { id: '60', label: '1 hour' },
  { id: 'never', label: 'Never' }
]
