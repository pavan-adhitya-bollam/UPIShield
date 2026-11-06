const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { rateLimiter } = require('./middlewares/rateLimiter');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/ApiResponse');

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const fraudRoutes = require('./routes/fraudRoutes');
const adminRoutes = require('./routes/adminRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.disable('x-powered-by');

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003'
];

if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting middleware
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  return res.status(200).json(ApiResponse.success(200, 'Server is running', {
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  }));
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use(notFound);

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;
