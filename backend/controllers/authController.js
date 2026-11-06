const { asyncHandler } = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { successResponse } = require('../utils/responseHelper');

const setAuthCookies = (res, tokens) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('accessToken', tokens.accessToken, cookieOptions);
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
  res.cookie('token', tokens.accessToken, cookieOptions);
};

const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('token', cookieOptions);
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  successResponse(res, 201, result, 'User registered successfully');
});

// @desc    Resend registration verification OTP
// @route   POST /api/auth/resend-verification-otp
// @access  Public
exports.resendVerificationOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendVerificationOtp(req.body.email);
  successResponse(res, 200, result, result.message);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get device info from request
  const deviceInfo = {
    device: req.headers['user-agent'] || 'Unknown',
    userAgent: req.headers['user-agent'] || 'Unknown',
    ipAddress: req.ip || 'Unknown'
  };

  const result = await authService.login(email, password, deviceInfo);

  setAuthCookies(res, result);

  successResponse(res, 200, result, 'Login successful');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user._id);

  clearAuthCookies(res);

  successResponse(res, 200, result, result.message);
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  const result = await authService.refreshToken(refreshToken);

  setAuthCookies(res, result);

  successResponse(res, 200, result, 'Token refreshed successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email, deliveryMethod } = req.body;

  const result = await authService.forgotPassword(email, deliveryMethod);

  successResponse(res, 200, result, result.message);
});

// @desc    Verify password reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
exports.verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyResetOtp(email, otp);
  successResponse(res, 200, result, result.message);
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const result = await authService.verifyEmail(email, otp);

  successResponse(res, 200, result, result.message);
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, resetToken, password } = req.body;

  const result = await authService.resetPassword(resetToken || token, password);

  successResponse(res, 200, result, result.message);
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const result = await authService.changePassword(req.user._id, currentPassword, newPassword);

  clearAuthCookies(res);

  successResponse(res, 200, result, result.message);
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user._id);

  successResponse(res, 200, result, 'Profile retrieved successfully');
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const result = await authService.updateProfile(req.user._id, req.body);

  successResponse(res, 200, result, result.message);
});

// @desc    Upload authenticated user's profile image
// @route   POST /api/auth/profile/image
// @access  Private
exports.uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw require('../utils/ApiError').badRequest('Please select an image file');
  }

  const result = await authService.updateProfile(req.user._id, {
    profileImage: `/uploads/profiles/${req.file.filename}`
  });

  successResponse(res, 200, result, result.message);
});
