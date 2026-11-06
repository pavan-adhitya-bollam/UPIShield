const { body } = require('express-validator');

// Register validation
exports.registerValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .custom((value) => {
      // Extract only digits from phone number
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) {
        throw new Error('Phone number must be 10 digits');
      }
      return true;
    }),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password must contain uppercase, lowercase, and a number'),

  body('profileImage')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Profile image must be a valid URL'),

  body('role')
    .optional()
    .isIn(['USER', 'MERCHANT', 'ADMIN']).withMessage('Role must be USER, MERCHANT, or ADMIN')
];

// Login validation
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Email verification validation
exports.verifyEmailValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must contain only digits')
];

exports.resendVerificationOtpValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Forgot password validation
exports.forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('deliveryMethod')
    .optional()
    .isIn(['email', 'sms']).withMessage('Delivery method must be email or sms')
];

// Password reset OTP validation
exports.verifyResetOtpValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must contain only digits')
];

// Reset password validation
exports.resetPasswordValidation = [
  body('resetToken')
    .trim()
    .notEmpty().withMessage('Reset token is required'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password must contain uppercase, lowercase, and a number')
];

// Refresh token validation
exports.refreshTokenValidation = [
  body('refreshToken')
    .trim()
    .notEmpty().withMessage('Refresh token is required')
];

// Change password validation
exports.changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('New password must contain uppercase, lowercase, and a number')
];
