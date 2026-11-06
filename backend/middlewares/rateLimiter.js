const rateLimit = require('express-rate-limit');

// Rate limiter middleware
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for auth routes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // Limit each IP to 5 requests per windowMs in production, 50 in development
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    error: 'Too many authentication attempts, please try again later'
  }
});

// Stricter rate limiter for fraud prediction
const fraudRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: {
    success: false,
    message: 'Too many fraud prediction requests, please try again later',
    error: 'Too many fraud prediction requests, please try again later'
  }
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  fraudRateLimiter
};
