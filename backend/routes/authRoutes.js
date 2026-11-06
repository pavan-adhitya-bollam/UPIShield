const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { authRateLimiter } = require('../middlewares/rateLimiter');
const uploadProfileImage = require('../middlewares/profileUpload');
const validate = require('../middlewares/validation');
const {
  registerValidation,
  resendVerificationOtpValidation,
  loginValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
  verifyResetOtpValidation,
  resetPasswordValidation,
  refreshTokenValidation,
  changePasswordValidation
} = require('../validators/authValidator');
const { body } = require('express-validator');

const updateProfileValidation = [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().trim().isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('phone').optional().trim().matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number')
];

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authRateLimiter, registerValidation, validate, authController.register);

// @route   POST /api/auth/resend-verification-otp
// @desc    Resend registration verification OTP
// @access  Public
router.post('/resend-verification-otp', authRateLimiter, resendVerificationOtpValidation, validate, authController.resendVerificationOtp);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authRateLimiter, loginValidation, validate, authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, authController.logout);

// @route   POST /api/auth/refresh
// @desc    Refresh token
// @access  Public
router.post('/refresh', refreshTokenValidation, validate, authController.refreshToken);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', authRateLimiter, forgotPasswordValidation, validate, authController.forgotPassword);

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify password reset OTP
// @access  Public
router.post('/verify-reset-otp', authRateLimiter, verifyResetOtpValidation, validate, authController.verifyResetOtp);

// @route   POST /api/auth/verify-email
// @desc    Verify email
// @access  Public
router.post('/verify-email', verifyEmailValidation, validate, authController.verifyEmail);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', protect, authRateLimiter, changePasswordValidation, validate, authController.changePassword);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, authController.getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfileValidation, validate, authController.updateProfile);

// @route   POST /api/auth/profile/image
// @desc    Upload authenticated user's profile image
// @access  Private
router.post('/profile/image', protect, uploadProfileImage, authController.uploadProfileImage);

module.exports = router;
