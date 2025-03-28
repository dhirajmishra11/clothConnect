const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware"); // Ensure authorize is imported
const User = require("../models/User");
const {
  getAdminStats,
  getDonationAnalytics,
  getAllUsers,
  verifyNGO,
  getAuditLogs,
  generateMonthlyReport,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/donations", protect, authorize("admin"), getDonationAnalytics);
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}); // Fetch all users
router.put("/ngos/:id/verify", protect, authorize("admin"), verifyNGO); // Verify NGO
router.get("/audit-logs", protect, authorize("admin"), getAuditLogs); // Fetch audit logs
router.get(
  "/monthly-report",
  protect,
  authorize("admin"),
  generateMonthlyReport
); // Generate monthly report

module.exports = router;
