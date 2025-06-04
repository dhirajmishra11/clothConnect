const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["donation", "pickup", "delivery", "system", "alert", "success", "info", "warning"],
      default: "info",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    action: {
      type: {
        type: String,
        enum: ["link", "button", "none"],
        default: "none"
      },
      url: String,
      text: String
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days from creation
    }
  },
  { 
    timestamps: true,
    index: { expiresAt: 1 }, // TTL index
  }
);

// Indexes for better query performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
