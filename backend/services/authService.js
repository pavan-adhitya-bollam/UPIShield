const User = require('../models/User');
const bcrypt = require('bcrypt');
const db = require('../database/connection');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const crypto = require('crypto');
const { generateOTP, maskEmail, maskPhone } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');
const { sendEmail } = require('./emailService');
const { sendSms, formatIndianPhoneNumber } = require('./smsService');

const normalizeRole = (role) => {
  if (!role) {
    return 'USER';
  }

  return String(role).trim().toUpperCase();
};

const buildSafeUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  email: user.email,
  phone: maskPhone(user.phone),
  profileImage: user.profileImage,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  loginHistory: user.loginHistory
});

const generateTokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');

const VERIFICATION_OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const setVerificationOtp = async (user, deliveryMethod = 'email', enforceCooldown = false) => {
  const now = Date.now();
  if (enforceCooldown &&
      user.emailVerificationOTPLastSentAt &&
      now - user.emailVerificationOTPLastSentAt.getTime() < VERIFICATION_OTP_RESEND_COOLDOWN_MS) {
    throw new ErrorResponse('Please wait before requesting another verification OTP', 429);
  }

  const otp = generateOTP();
  user.emailVerificationOTPHash = generateTokenHash(otp);
  user.emailVerificationOTPExpires = now + 10 * 60 * 1000;
  user.emailVerificationOTPLastSentAt = new Date(now);
  await user.save();

  try {
    if (deliveryMethod === 'sms') {
      await sendSms({
        recipient: user.phone,
        content: `Your UPI Shield verification OTP is ${otp}. It expires in 10 minutes. Do not share this code.`,
        tag: 'registration-verification'
      });
    } else {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address – UPI Shield',
        text: `Hello ${user.firstName || 'User'},\n\nYour UPI Shield verification OTP is ${otp}. It expires in 10 minutes.\n\nDo not share this OTP with anyone.\n\nUPI Shield`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937;line-height:1.6">
          <h2 style="color:#111827">UPI Shield</h2>
          <p>Hello ${user.firstName || 'User'},</p>
          <p>Thank you for registering. Use the following one-time password to verify your email address:</p>
          <p style="font-size:32px;letter-spacing:8px;font-weight:700;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px;color:#111827">${otp}</p>
          <p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
        `
      });
    }
  } catch (error) {
    user.emailVerificationOTPHash = null;
    user.emailVerificationOTPExpires = null;
    user.emailVerificationOTPLastSentAt = null;
    await user.save({ validateModifiedOnly: true });
    throw error;
  }
};

const PASSWORD_RESET_OTP_TTL_MS = 10 * 60 * 1000;
const PASSWORD_RESET_TOKEN_TTL_MS = 10 * 60 * 1000;
const PASSWORD_RESET_RESEND_COOLDOWN_MS = 60 * 1000;
const PASSWORD_RESET_MAX_ATTEMPTS = 5;

const setPasswordResetOtp = async (user, deliveryMethod = 'email') => {
  const now = Date.now();
  if (user.passwordResetOTPLastSentAt &&
      now - user.passwordResetOTPLastSentAt.getTime() < PASSWORD_RESET_RESEND_COOLDOWN_MS) {
    throw new ErrorResponse('Please wait before requesting another OTP', 429);
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  user.passwordResetOTPHash = await bcrypt.hash(otp, 10);
  user.passwordResetOTPExpires = now + PASSWORD_RESET_OTP_TTL_MS;
  user.passwordResetOTPAttempts = 0;
  user.passwordResetOTPLastSentAt = new Date(now);
  user.passwordResetTokenHash = null;
  user.passwordResetTokenExpires = null;
  await user.save();

  try {
    if (deliveryMethod === 'sms') {
      await sendSms({
        recipient: user.phone,
        content: `Your UPI Shield password reset OTP is ${otp}. It expires in 10 minutes. Do not share this code.`,
        tag: 'password-reset'
      });
    } else {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset OTP – UPI Fraud Detection System',
        text: `Hello ${user.firstName},\n\nYour password reset OTP is ${otp}. It expires in 10 minutes.\n\nDo not share this OTP with anyone. If you did not request a password reset, you can ignore this email.\n\nUPI Fraud Detection System`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937;line-height:1.6">
          <h2 style="color:#111827">UPI Fraud Detection System</h2>
          <p>Hello ${user.firstName},</p>
          <p>Use the following one-time password to reset your account password:</p>
          <p style="font-size:32px;letter-spacing:8px;font-weight:700;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px">${otp}</p>
          <p>This OTP expires in <strong>10 minutes</strong>. Never share it with anyone.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `
      });
    }
  } catch (error) {
    user.passwordResetOTPHash = null;
    user.passwordResetOTPExpires = null;
    user.passwordResetOTPAttempts = 0;
    user.passwordResetOTPLastSentAt = null;
    await user.save({ validateModifiedOnly: true });
    throw error;
  }
};

// Register new user
const register = async (userData) => {
  await db.ensureConnected();
  const { firstName, lastName, email, phone, password, profileImage, role } = userData;
  const normalizedRole = normalizeRole(role);
  
  // Handle missing or empty lastName
  const finalLastName = lastName && lastName.trim() ? lastName.trim() : '';
  
  // Normalize phone number - extract only digits
  const normalizedPhone = phone ? phone.replace(/\D/g, '') : '';

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone: normalizedPhone }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      if (!existingUser.isEmailVerified) {
        existingUser.firstName = firstName;
        existingUser.lastName = finalLastName;
        existingUser.fullName = `${firstName} ${finalLastName}`.trim();
        existingUser.phone = normalizedPhone;
        existingUser.password = password;
        if (profileImage) existingUser.profileImage = profileImage;
        existingUser.role = normalizedRole;
        await existingUser.save();

        const registrationDeliveryMethod =
          process.env.SMS_REGISTRATION_VERIFICATION_ENABLED === 'true' ? 'sms' : 'email';
        await setVerificationOtp(existingUser, registrationDeliveryMethod);

        return {
          user: buildSafeUser(existingUser),
          verificationSent: true,
          verificationMethod: registrationDeliveryMethod
        };
      }
      throw new ErrorResponse('Email already registered', 400);
    }
    if (existingUser.phone === normalizedPhone) {
      if (!existingUser.isEmailVerified && existingUser.email === email) {
        // Handled above
      } else {
        throw new ErrorResponse('Phone number already registered', 400);
      }
    }
  }

  if (normalizedRole === 'ADMIN' && process.env.ALLOW_ADMIN_REGISTRATION !== 'true') {
    throw new ErrorResponse('Admin registration is not allowed', 403);
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName: finalLastName,
    fullName: `${firstName} ${finalLastName}`.trim(),
    email,
    phone: normalizedPhone,
    password,
    profileImage: profileImage || null,
    role: normalizedRole
  });

  const registrationDeliveryMethod =
    process.env.SMS_REGISTRATION_VERIFICATION_ENABLED === 'true' ? 'sms' : 'email';
  await setVerificationOtp(user, registrationDeliveryMethod);

  return {
    user: buildSafeUser(user),
    verificationSent: true,
    verificationMethod: registrationDeliveryMethod
  };

};

const resendVerificationOtp = async (email) => {
  await db.ensureConnected();
  const user = await User.findOne({ email }).select(
    '+emailVerificationOTPHash +emailVerificationOTPExpires +emailVerificationOTPLastSentAt'
  );

  if (!user) {
    throw new ErrorResponse('No account found for this email address', 404);
  }
  if (user.isEmailVerified) {
    throw new ErrorResponse('This email address is already verified', 400);
  }

  await setVerificationOtp(user, 'email', true);
  return { message: 'A new verification OTP has been sent to your email address.' };
};

// Login user
const login = async (loginIdentifier, password, deviceInfo) => {
  const normalizedIdentifier = loginIdentifier.includes('@')
    ? loginIdentifier.toLowerCase().trim()
    : loginIdentifier.replace(/\D/g, '');

  // Find user and include password for comparison
  const user = await User.findOne({
    [normalizedIdentifier.includes('@') ? 'email' : 'phone']: normalizedIdentifier
  }).select('+password +refreshToken');

  if (!user) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ErrorResponse('Account is inactive', 403);
  }

  if (!user.isEmailVerified) {
    throw new ErrorResponse('Please verify your email before logging in', 403);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    // Add failed login attempt
    await user.addLoginHistory({
      ...deviceInfo,
      status: 'FAILED'
    });
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Generate tokens
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.addLoginHistory({
    ...deviceInfo,
    status: 'SUCCESS'
  });

  return {
    user: buildSafeUser(user),
    accessToken,
    refreshToken
  };
};

// Logout user
const logout = async (userId) => {
  const user = await User.findById(userId).select('+refreshToken');

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  // Clear refresh token
  user.refreshToken = null;
  await user.save();

  return { message: 'Logged out successfully' };
};

// Refresh token
const refreshToken = async (incomingRefreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(incomingRefreshToken);

    // Find user
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    // Check if refresh token matches
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ErrorResponse('Invalid refresh token', 401);
    }

    // Generate new tokens
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    throw new ErrorResponse('Invalid or expired refresh token', 401);
  }
};

// Forgot password
const forgotPassword = async (email, deliveryMethod = 'email') => {
  await db.ensureConnected();
  const user = await User.findOne({ email }).select(
    '+phone +passwordResetOTPHash +passwordResetOTPExpires +passwordResetOTPAttempts +passwordResetOTPLastSentAt'
  );

  if (!user) {
    return {
      message: 'If an account exists for that email, a password reset OTP has been sent.'
    };
  }

  if (deliveryMethod === 'sms' && !user.phone) {
    throw new ErrorResponse('No registered mobile number is available. Email recovery is available.', 400);
  }

  if (deliveryMethod === 'sms') {
    formatIndianPhoneNumber(user.phone);
  }

  await setPasswordResetOtp(user, deliveryMethod);

  return {
    message: deliveryMethod === 'sms'
      ? 'Password reset OTP accepted by the SMS provider.'
      : 'If an account exists for that email, a password reset OTP has been sent.',
    deliveryMethod,
    maskedPhone: deliveryMethod === 'sms' ? maskPhone(user.phone) : undefined
  };
};

const verifyResetOtp = async (email, otp) => {
  await db.ensureConnected();
  const user = await User.findOne({ email }).select(
    '+passwordResetOTPHash +passwordResetOTPExpires +passwordResetOTPAttempts +passwordResetTokenHash +passwordResetTokenExpires'
  );

  if (!user || !user.passwordResetOTPHash || !user.passwordResetOTPExpires ||
      user.passwordResetOTPExpires.getTime() <= Date.now()) {
    throw new ErrorResponse('Invalid or expired OTP', 400);
  }

  if (user.passwordResetOTPAttempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
    throw new ErrorResponse('Too many invalid OTP attempts. Request a new OTP.', 429);
  }

  const otpMatches = await bcrypt.compare(otp, user.passwordResetOTPHash);
  if (!otpMatches) {
    user.passwordResetOTPAttempts += 1;
    await user.save({ validateModifiedOnly: true });
    throw new ErrorResponse('Invalid OTP', 400);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetTokenHash = generateTokenHash(resetToken);
  user.passwordResetTokenExpires = Date.now() + PASSWORD_RESET_TOKEN_TTL_MS;
  user.passwordResetOTPHash = null;
  user.passwordResetOTPExpires = null;
  user.passwordResetOTPAttempts = 0;
  user.passwordResetOTPLastSentAt = null;
  await user.save({ validateModifiedOnly: true });

  return {
    message: 'OTP verified successfully',
    resetToken
  };
};

// Verify email
const verifyEmail = async (email, otp) => {
  const user = await User.findOne({ email }).select('+emailVerificationOTPHash +emailVerificationOTPExpires');

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  const hashedOtp = generateTokenHash(otp);

  if (!user.emailVerificationOTPHash || user.emailVerificationOTPHash !== hashedOtp) {
    throw new ErrorResponse('Invalid OTP', 400);
  }

  if (user.emailVerificationOTPExpires < Date.now()) {
    throw new ErrorResponse('OTP has expired', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationOTPHash = null;
  user.emailVerificationOTPExpires = null;
  await user.save();

  // Generate tokens after successful verification
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  return { 
    message: 'Email verified successfully',
    accessToken,
    refreshToken,
    user: buildSafeUser(user)
  };
};

// Reset password
const resetPassword = async (token, password) => {
  await db.ensureConnected();
  const user = await User.findOne({
    passwordResetTokenHash: generateTokenHash(token),
    passwordResetTokenExpires: { $gt: Date.now() }
  }).select('+password +refreshToken');

  if (!user) {
    throw new ErrorResponse('Invalid or expired token', 400);
  }

  // Update password
  user.password = password;
  user.passwordResetTokenHash = null;
  user.passwordResetTokenExpires = null;
  user.passwordResetOTPHash = null;
  user.passwordResetOTPExpires = null;
  user.passwordResetOTPAttempts = 0;
  user.passwordResetOTPLastSentAt = null;
  user.refreshToken = null;
  await user.save();

  return { message: 'Password reset successfully' };
};

// Change password
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password +refreshToken');

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  const passwordMatches = await user.comparePassword(currentPassword);

  if (!passwordMatches) {
    throw new ErrorResponse('Current password is invalid', 400);
  }

  user.password = newPassword;
  user.refreshToken = null;
  await user.save();

  return { message: 'Password changed successfully' };
};

// Get user profile
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken -passwordResetTokenHash -passwordResetTokenExpires -emailVerificationOTPHash -emailVerificationOTPExpires');

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  return {
    ...buildSafeUser(user),
    phone: user.phone
  };
};

// Update user profile
const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  // Update allowed fields
  const allowedFields = ['firstName', 'lastName', 'phone', 'profileImage'];
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  if (updateData.firstName || updateData.lastName) {
    user.fullName = `${user.firstName} ${user.lastName}`.trim();
  }

  if (updateData.phone !== undefined) {
    const existingUser = await User.findOne({
      phone: user.phone,
      _id: { $ne: user._id }
    }).select('_id');

    if (existingUser) {
      throw new ErrorResponse('Phone number already in use', 409);
    }
  }

  try {
    await user.save();
  } catch (error) {
    if (error?.code === 11000 && error.keyPattern?.phone) {
      throw new ErrorResponse('Phone number already in use', 409);
    }
    throw error;
  }

  return {
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  };
};

module.exports = {
  register,
  resendVerificationOtp,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyResetOtp,
  verifyEmail,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile
};
