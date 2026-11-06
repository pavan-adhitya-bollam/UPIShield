const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate transaction ID
const generateTransactionId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TXN${timestamp}${randomStr}`;
};

// Generate reference number
const generateReferenceNumber = () => {
  const timestamp = Date.now().toString();
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `REF${timestamp}${randomStr}`;
};

// Generate receipt number
const generateReceiptNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `RCPT${timestamp}${randomStr}`;
};

// Generate prediction ID
const generatePredictionId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `PRED${timestamp}${randomStr}`;
};

// Generate beneficiary ID
const generateBeneficiaryId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `BEN${timestamp}${randomStr}`;
};

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// Format currency
const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format datetime
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Mask email
const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
  return `${maskedUsername}@${domain}`;
};

// Mask phone number
const maskPhone = (phone) => {
  return phone.substring(0, 2) + '*'.repeat(phone.length - 4) + phone.substring(phone.length - 2);
};

// Mask account number
const maskAccountNumber = (accountNumber) => {
  return '*'.repeat(accountNumber.length - 4) + accountNumber.substring(accountNumber.length - 4);
};

// Validate UPI ID
const isValidUpiId = (upiId) => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return upiRegex.test(upiId);
};

// Validate IFSC code
const isValidIfscCode = (ifscCode) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifscCode);
};

// Get time of day
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
};

// Check if business hours
const isBusinessHour = () => {
  const hour = new Date().getHours();
  return hour >= 9 && hour < 18;
};

// Get day of week
const getDayOfWeek = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

// Calculate days between dates
const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Parse pagination parameters
const parsePagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Parse sort parameters
const parseSort = (query, defaultSort = { createdAt: -1 }) => {
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: sortOrder };
};

module.exports = {
  generateRandomString,
  generateTransactionId,
  generateReferenceNumber,
  generateReceiptNumber,
  generatePredictionId,
  generateBeneficiaryId,
  generateOTP,
  formatCurrency,
  formatDate,
  formatDateTime,
  calculateAge,
  maskEmail,
  maskPhone,
  maskAccountNumber,
  isValidUpiId,
  isValidIfscCode,
  getTimeOfDay,
  isBusinessHour,
  getDayOfWeek,
  daysBetween,
  parsePagination,
  parseSort
};
