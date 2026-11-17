const rateLimit = require('express-rate-limit');

// Rate limiter middleware
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: { trustProxy: false }
});

// Rate limiter for auth routes (generous for multi-user shared NAT/mobile networks)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 120, // Allow up to 120 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    error: 'Too many authentication attempts, please try again later'
  }
});

// Rate limiter for fraud prediction
const fraudRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.FRAUD_RATE_LIMIT_MAX) || 60, // Limit each IP to 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
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
