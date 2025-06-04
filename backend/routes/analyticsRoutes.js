const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAnalytics,
  getAuditLogs,
  getMonthlyReport,
} = require("../controllers/analyticsController");

const router = express.Router();

// Analytics endpoints
router.get("/", protect, authorize("admin"), getAnalytics);
router.get("/audit-logs", protect, authorize("admin"), getAuditLogs);
router.get("/monthly-report", protect, authorize("admin"), getMonthlyReport);

module.exports = router;
