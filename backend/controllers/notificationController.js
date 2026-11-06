const asyncHandler = require('express-async-handler');
const notificationService = require('../services/notificationService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    isRead: req.query.isRead,
    type: req.query.type,
    priority: req.query.priority,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };

  const result = await notificationService.getUserNotifications(req.user._id, filters);

  paginatedResponse(res, 200, result.notifications, result.pagination, 'Notifications retrieved successfully', {
    unreadCount: result.unreadCount
  });
});

// @desc    Get notification count
// @route   GET /api/notifications/count
// @access  Private
exports.getNotificationCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotificationCount(req.user._id);

  successResponse(res, 200, result, 'Notification count retrieved successfully');
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const result = await notificationService.markAsRead(notificationId, req.user._id);

  successResponse(res, 200, result, result.message);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);

  successResponse(res, 200, result, result.message);
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:notificationId
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const result = await notificationService.deleteNotification(notificationId, req.user._id);

  successResponse(res, 200, result, result.message);
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
exports.deleteAllNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteAllNotifications(req.user._id);

  successResponse(res, 200, result, result.message);
});
