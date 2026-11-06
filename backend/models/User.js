const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    default: ''
  },
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  mpinHash: {
    type: String,
    select: false,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['USER', 'MERCHANT', 'ADMIN'],
    default: 'USER'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginHistory: [{
    device: String,
    userAgent: String,
    ipAddress: String,
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED']
    },
    loginAt: {
      type: Date,
      default: Date.now
    }
  }],
  passwordResetTokenHash: {
    type: String,
    select: false
  },
  passwordResetTokenExpires: {
    type: Date,
    select: false
  },
  passwordResetOTPHash: {
    type: String,
    select: false,
    default: null
  },
  passwordResetOTPExpires: {
    type: Date,
    select: false,
    default: null
  },
  passwordResetOTPAttempts: {
    type: Number,
    select: false,
    default: 0
  },
  passwordResetOTPLastSentAt: {
    type: Date,
    select: false,
    default: null
  },
  emailVerificationOTPHash: {
    type: String,
    select: false
  },
  emailVerificationOTPExpires: {
    type: Date,
    select: false
  },
  emailVerificationOTPLastSentAt: {
    type: Date,
    select: false,
    default: null
  },
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();

  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.virtual('displayName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.password;
    delete ret.mpinHash;
    delete ret.refreshToken;
    delete ret.passwordResetTokenHash;
    delete ret.passwordResetTokenExpires;
    delete ret.passwordResetOTPHash;
    delete ret.passwordResetOTPExpires;
    delete ret.passwordResetOTPAttempts;
    delete ret.passwordResetOTPLastSentAt;
    delete ret.emailVerificationOTPHash;
    delete ret.emailVerificationOTPExpires;
    delete ret.emailVerificationOTPLastSentAt;
    return ret;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.setMpin = async function(mpin) {
  this.mpinHash = await bcrypt.hash(mpin, 10);
  await this.save({ validateModifiedOnly: true });
};

userSchema.methods.compareMpin = async function(candidateMpin) {
  if (!this.mpinHash) {
    return false;
  }

  return await bcrypt.compare(candidateMpin, this.mpinHash);
};

// Method to add login history
userSchema.methods.addLoginHistory = async function(loginData) {
  this.loginHistory.push(loginData);
  this.lastLogin = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
