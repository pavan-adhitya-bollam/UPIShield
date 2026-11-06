const Notification = require('../models/Notification');
const { parsePagination, parseSort } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');

// Create notification
const createNotification = async (notificationData) => {
  const { userId, type, title, message, priority, actionRequired, actionType, actionUrl, relatedTransactionId, relatedUserId, metadata } = notificationData;

  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    priority,
    actionRequired,
    actionType,
    actionUrl,
    relatedTransactionId,
    relatedUserId,
    metadata
  });

  return notification;
};

// Get user notifications
const getUserNotifications = async (userId, filters = {}) => {
  const { page, limit, skip } = parsePagination(filters);
  const sort = parseSort(filters);

  const query = { userId };

  if (filters.isRead !== undefined) {
    query.isRead = filters.isRead;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  const notifications = await Notification.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(query);

  // Get unread count
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return {
    notifications,
    pagination: {
      page,
      limit,
      total
    },
    unreadCount
  };
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId
  });

  if (!notification) {
    throw new ErrorResponse('Notification not found', 404);
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return {
    message: 'Notification marked as read',
    notification
  };
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  return {
    message: 'All notifications marked as read'
  };
};

// Delete notification
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId
  });

  if (!notification) {
    throw new ErrorResponse('Notification not found', 404);
  }

  await Notification.findByIdAndDelete(notificationId);

  return {
    message: 'Notification deleted successfully'
  };
};

// Delete all notifications
const deleteAllNotifications = async (userId) => {
  await Notification.deleteMany({ userId });

  return {
    message: 'All notifications deleted successfully'
  };
};

// Get notification count
const getNotificationCount = async (userId) => {
  const totalCount = await Notification.countDocuments({ userId });
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return {
    totalCount,
    unreadCount
  };
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationCount
};
