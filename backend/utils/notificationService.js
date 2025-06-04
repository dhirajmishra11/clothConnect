const webpush = require('web-push');
const { createAuditLog } = require('./loggingService');

let io;

// Initialize Socket.IO
function initializeSocketIO(server) {
  io = require('socket.io')(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      createAuditLog({
        action: 'SOCKET_CONNECTION',
        category: 'SYSTEM',
        status: 'SUCCESS',
        details: { userId, socketId: socket.id },
        userId
      });
    });

    socket.on('disconnect', () => {
      createAuditLog({
        action: 'SOCKET_DISCONNECTION',
        category: 'SYSTEM',
        status: 'INFO',
        details: { socketId: socket.id }
      });
    });
  });

  return io;
}

// Initialize Web Push
function initializeWebPush() {
  webpush.setVapidDetails(
    `mailto:${process.env.SUPPORT_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Send real-time notification
async function sendRealTimeNotification(userId, notification) {
  try {
    if (io) {
      io.to(`user_${userId}`).emit('notification', notification);
    }

    // Save notification to database
    const newNotification = await new Notification({
      user: userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      data: notification.data
    }).save();

    createAuditLog({
      action: 'NOTIFICATION_SENT',
      category: 'SYSTEM',
      status: 'SUCCESS',
      details: { notificationId: newNotification._id },
      userId
    });

    return newNotification;
  } catch (error) {
    createAuditLog({
      action: 'NOTIFICATION_ERROR',
      category: 'SYSTEM',
      status: 'ERROR',
      details: { error: error.message },
      userId,
      errorStack: error.stack
    });
    throw error;
  }
}

// Send push notification
async function sendPushNotification(userId, notification) {
  try {
    const user = await User.findById(userId).select('pushSubscription');
    if (!user?.pushSubscription) return;

    await webpush.sendNotification(
      user.pushSubscription,
      JSON.stringify(notification)
    );

    createAuditLog({
      action: 'PUSH_NOTIFICATION_SENT',
      category: 'SYSTEM',
      status: 'SUCCESS',
      details: notification,
      userId
    });
  } catch (error) {
    createAuditLog({
      action: 'PUSH_NOTIFICATION_ERROR',
      category: 'SYSTEM',
      status: 'ERROR',
      details: { error: error.message },
      userId,
      errorStack: error.stack
    });
    
    // Handle expired subscriptions
    if (error.statusCode === 410) {
      await User.findByIdAndUpdate(userId, { 
        $unset: { pushSubscription: 1 } 
      });
    }
    throw error;
  }
}

// Send notification through all available channels
async function sendNotification(userId, notification) {
  try {
    // Send real-time notification
    await sendRealTimeNotification(userId, notification);

    // Send push notification if applicable
    if (notification.sendPush) {
      await sendPushNotification(userId, notification);
    }

    // Send email notification if applicable
    if (notification.sendEmail) {
      await emailService.sendNotificationEmail(
        user.email,
        notification.title,
        notification.message
      );
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

module.exports = {
  initializeSocketIO,
  initializeWebPush,
  sendNotification,
  sendRealTimeNotification,
  sendPushNotification
};