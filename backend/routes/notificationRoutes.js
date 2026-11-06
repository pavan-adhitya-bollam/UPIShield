const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', protect, notificationController.getUserNotifications);

// @route   GET /api/notifications/count
// @desc    Get notification count
// @access  Private
router.get('/count', protect, notificationController.getNotificationCount);

// @route   PUT /api/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private
router.put('/:notificationId/read', protect, notificationController.markAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, notificationController.markAllAsRead);

// @route   DELETE /api/notifications/:notificationId
// @desc    Delete notification
// @access  Private
router.delete('/:notificationId', protect, notificationController.deleteNotification);

// @route   DELETE /api/notifications
// @desc    Delete all notifications
// @access  Private
router.delete('/', protect, notificationController.deleteAllNotifications);

module.exports = router;
