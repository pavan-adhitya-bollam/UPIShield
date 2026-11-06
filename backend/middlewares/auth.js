const User = require('../models/User');
const { verifyToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');

const getAccessToken = (req) => {
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    const token = getAccessToken(req);

    if (!token) {
      return next(ApiError.unauthorized('Not authorized to access this route'));
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password -refreshToken -passwordResetTokenHash -passwordResetTokenExpires -emailVerificationOTPHash -emailVerificationOTPExpires');
      
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }

      if (!req.user.isActive) {
        return next(ApiError.forbidden('Account is inactive'));
      }

      next();
    } catch (error) {
      return next(ApiError.unauthorized('Token is invalid or expired'));
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const normalizedRole = String(req.user.role || '').toUpperCase();
    const normalizedAllowedRoles = roles.map((role) => String(role).toUpperCase());

    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      return next(ApiError.forbidden(`User role '${req.user.role}' is not authorized to access this route`));
    }
    next();
  };
};

// Optional auth - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = getAccessToken(req);

    if (token) {
      try {
        const decoded = verifyToken(token);
        req.user = await User.findById(decoded.id).select('-password -refreshToken -passwordResetTokenHash -passwordResetTokenExpires -emailVerificationOTPHash -emailVerificationOTPExpires');
      } catch (error) {
        // Invalid token, continue without user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
