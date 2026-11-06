const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { body } = require('express-validator');

// Validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number')
];

const updateProfilePictureValidation = [
  body('profileImage')
    .notEmpty().withMessage('Profile image URL is required')
    .isURL().withMessage('Profile image must be a valid URL')
];

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfileValidation, validate, userController.updateProfile);

// @route   PUT /api/users/profile-picture
// @desc    Update profile picture
// @access  Private
router.put('/profile-picture', protect, updateProfilePictureValidation, validate, userController.updateProfilePicture);

module.exports = router;
