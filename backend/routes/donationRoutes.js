const express = require("express");
const {
  createDonation,
  getUserDonations,
  getAllDonations,
  updateDonationStatus,
  getPublicDonations,
} = require("../controllers/donationController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new donation
router.post("/", protect, createDonation);

// Get logged-in user's donations
router.get("/my-donations", protect, getUserDonations);

// Update donation status
router.put("/:id", protect, updateDonationStatus);

// Get public donations (no auth required)
router.get("/public", getPublicDonations);

// Admin routes
router.get("/admin", protect, authorize("admin"), getAllDonations);

// Get all donations (admin only)
router.get("/", protect, getAllDonations);

module.exports = router;
