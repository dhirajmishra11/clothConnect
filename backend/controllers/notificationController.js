const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/notificationService');
const { createAuditLog } = require('../utils/loggingService');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ user: req.user._id });

        res.json({
            notifications,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        createAuditLog({
            action: 'GET_NOTIFICATIONS',
            category: 'NOTIFICATION',
            status: 'ERROR',
            details: { error: error.message },
            userId: req.user._id,
            errorStack: error.stack
        });
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

// Create and send a new notification
exports.createNotification = async (req, res) => {
    try {
        const { userId, title, message, type, priority, data, action } = req.body;

        const notification = await sendNotification(userId, {
            title,
            message,
            type,
            priority,
            data,
            action,
            sendPush: true,
            sendEmail: priority === 'urgent'
        });

        res.status(201).json(notification);
    } catch (error) {
        createAuditLog({
            action: 'CREATE_NOTIFICATION',
            category: 'NOTIFICATION',
            status: 'ERROR',
            details: { error: error.message },
            userId: req.body.userId,
            errorStack: error.stack
        });
        res.status(500).json({ error: 'Error creating notification' });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        createAuditLog({
            action: 'MARK_NOTIFICATION_READ',
            category: 'NOTIFICATION',
            status: 'SUCCESS',
            details: { notificationId: notification._id },
            userId: req.user._id
        });

        res.json(notification);
    } catch (error) {
        createAuditLog({
            action: 'MARK_NOTIFICATION_READ',
            category: 'NOTIFICATION',
            status: 'ERROR',
            details: { error: error.message },
            userId: req.user._id,
            errorStack: error.stack
        });
        res.status(500).json({ error: 'Error marking notification as read' });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { read: true }
        );

        createAuditLog({
            action: 'MARK_ALL_NOTIFICATIONS_READ',
            category: 'NOTIFICATION',
            status: 'SUCCESS',
            userId: req.user._id
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        createAuditLog({
            action: 'MARK_ALL_NOTIFICATIONS_READ',
            category: 'NOTIFICATION',
            status: 'ERROR',
            details: { error: error.message },
            userId: req.user._id,
            errorStack: error.stack
        });
        res.status(500).json({ error: 'Error marking all notifications as read' });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        createAuditLog({
            action: 'DELETE_NOTIFICATION',
            category: 'NOTIFICATION',
            status: 'SUCCESS',
            details: { notificationId: notification._id },
            userId: req.user._id
        });

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        createAuditLog({
            action: 'DELETE_NOTIFICATION',
            category: 'NOTIFICATION',
            status: 'ERROR',
            details: { error: error.message },
            userId: req.user._id,
            errorStack: error.stack
        });
        res.status(500).json({ error: 'Error deleting notification' });
    }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            user: req.user._id,
            read: false
        });

        res.json({ count });
    } catch (error) {
        createAuditLog({
            action: 'GET_UNREAD_COUNT',
            category: 'NOTIFICATION',
            status: 'ERROR',
            details: { error: error.message },
            userId: req.user._id,
            errorStack: error.stack
        });
        res.status(500).json({ error: 'Error getting unread count' });
    }
};
