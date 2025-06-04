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
  distributeCollectionItems,
} = require("../controllers/ngoController");

const router = express.Router();

// NGO Management Routes
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

// Donation Management Routes
router.get("/donations", protect, getNGODonations); // Fetch NGO-specific donations
router.put("/donations/:id", protect, updateDonationStatus); // Update donation status
router.put("/donations/:id/assign", protect, assignDonationToTeam); // Assign donation to team

// Collection Management Routes
router.get("/collection", protect, getCollection); // Fetch collected donations
router.post("/donated", protect, markAsDonated); // Mark clothes as donated
router.put("/collection/:id/distribute", protect, distributeCollectionItems); // Distribute collection items

// Analytics and Export Routes
router.get("/analytics", protect, getNGOAnalytics); // Fetch NGO analytics
router.get("/export", protect, exportDonations); // Export donations

// Notification and Status Routes
router.get("/notifications", protect, getNotifications); // Fetch notifications
router.get("/pending-donations", protect, getPendingDonations); // Fetch pending donations
router.get("/pickups", protect, getPickups); // Fetch donations accepted by the NGO

module.exports = router;
