const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      user: req.user._id,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification" });
  }
};
