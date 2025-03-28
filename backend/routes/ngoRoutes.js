const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User"); // Use the User model instead of NGO
const {
  createNGO,
  verifyNGO,
  getNGODonations,
  updateDonationStatus,
  getNGOAnalytics,
  assignDonationToTeam,
  exportDonations,
  getNotifications,
  getPendingDonations,
  getPickups,
  getCollection,
  markAsDonated,
} = require("../controllers/ngoController");

const router = express.Router();

router.post("/", protect, createNGO);
router.get("/", protect, async (req, res) => {
  try {
    const ngos = await User.find({ role: "ngo" }).select("-password"); // Fetch users with role 'ngo'
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs", error });
  }
});
router.put("/:id/verify", protect, verifyNGO);
router.get("/donations", protect, getNGODonations); // Fetch NGO-specific donations
router.put("/donations/:id", protect, updateDonationStatus); // Update donation status
router.get("/analytics", protect, getNGOAnalytics); // Fetch NGO analytics
router.put("/donations/:id/assign", protect, assignDonationToTeam); // Assign donation to team
router.get("/export", protect, exportDonations); // Export donations
router.get("/notifications", protect, getNotifications); // Fetch notifications
router.get("/pending-donations", protect, getPendingDonations); // Fetch pending donations
router.get("/pickups", protect, getPickups); // Fetch donations accepted by the NGO
router.get("/collection", protect, getCollection); // Fetch collected donations
router.post("/donated", protect, markAsDonated); // Mark clothes as donated

module.exports = router;
