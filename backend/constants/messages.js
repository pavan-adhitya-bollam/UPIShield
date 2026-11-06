/**
 * Application Messages
 * Standardized messages for API responses
 */
const messages = {
  // Success Messages
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Auth Messages
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  PASSWORD_RESET: 'Password reset successfully',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',

  // Transaction Messages
  TRANSACTION_INITIATED: 'Transaction initiated successfully',
  TRANSACTION_COMPLETED: 'Transaction completed successfully',
  TRANSACTION_CANCELLED: 'Transaction cancelled successfully',
  RECEIPT_GENERATED: 'Receipt generated successfully',

  // Fraud Messages
  FRAUD_ANALYSIS_COMPLETED: 'Fraud analysis completed',
  PREDICTION_VERIFIED: 'Prediction verified successfully',

  // Error Messages
  BAD_REQUEST: 'Invalid request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',

  // User Messages
  USER_NOT_FOUND: 'User not found',
  USER_SUSPENDED: 'Account is suspended',
  USER_INACTIVE: 'Account is inactive',

  // Transaction Messages
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_FAILED: 'Transaction failed',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  LIMIT_EXCEEDED: 'Transaction limit exceeded',

  // General Messages
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_TOKEN: 'Invalid or expired token',
  PERMISSION_DENIED: 'Permission denied'
};

module.exports = messages;
