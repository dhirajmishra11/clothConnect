const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/analyticsController");
const User = require("../models/User");
const Donation = require("../models/Donation");

// Middleware to verify admin role
router.use(protect, authorize("admin"));

// Get all donors
router.get("/donors", async (req, res) => {
  try {
    const donors = await User.find({ role: "donor" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donors", error: error.message });
  }
});

// Get all NGOs
router.get("/ngos", async (req, res) => {
  try {
    const ngos = await User.find({ role: "ngo" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs", error: error.message });
  }
});

// Get analytics data
router.get("/analytics", getAnalytics);

// Verify NGO
router.put("/ngos/:id/verify", async (req, res) => {
  try {
    const ngo = await User.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    ).select("-password");

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: "Error verifying NGO", error: error.message });
  }
});

module.exports = router;