const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  return ApiResponse.success(res, 200, 'Profile retrieved successfully', user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  // Update allowed fields
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (phone !== undefined) {
    // Check if phone is already taken by another user
    const existingUser = await User.findOne({ phone, _id: { $ne: req.user.id } });
    if (existingUser) {
      return ApiResponse.error(res, 400, 'Phone number already in use');
    }
    user.phone = phone;
  }

  await user.save();

  return ApiResponse.success(res, 200, 'Profile updated successfully', user);
});

// @desc    Update profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
exports.updateProfilePicture = asyncHandler(async (req, res) => {
  const { profileImage } = req.body;

  if (!profileImage) {
    return ApiResponse.error(res, 400, 'Profile image URL is required');
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  user.profileImage = profileImage;
  await user.save();

  return ApiResponse.success(res, 200, 'Profile picture updated successfully', user);
});
