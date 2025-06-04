const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["distribute", "collect", "verify", "delete", "update"],
    },
    resourceType: {
      type: String,
      required: true,
      enum: ["Collection", "Donation", "NGO", "User", "Pickup"],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    changes: {
      before: Object,
      after: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookups
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
