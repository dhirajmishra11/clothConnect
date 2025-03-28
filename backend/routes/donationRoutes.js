const express = require("express");
const {
  createDonation,
  getUserDonations,
  getAllDonations,
  updateDonationStatus,
} = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const Donation = require("../models/Donation");
const Pickup = require("../models/Pickup");

// Create a new donation
router.post("/", protect, async (req, res) => {
  const { clothesType, quantity, address, city, pincode, title, phone, pickupDate, message } = req.body;

  try {
    if (!clothesType || !quantity || !address || !city || !pincode) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const donation = new Donation({
      donor: req.user._id,
      clothesType,
      quantity,
      address,
      city,
      pincode,
      title,
      phone,
      pickupDate,
      message,
    });

    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error creating donation", error });
  }
});

// Get logged-in user's donations from both collections
router.get("/my-donations", protect, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id });
    const pickups = await Pickup.find({ donor: req.user._id });
    
    res.status(200).json([...donations, ...pickups]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
});

// Accept or reject a donation
router.put("/:id", protect, async (req, res) => {
  const { status, ngoId } = req.body;

  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (!ngoId || req.user._id.toString() !== ngoId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    donation.status = status;
    donation.ngo = ngoId;
    await donation.save();

    if (status === "Accepted") {
      const pickup = new Pickup({
        donor: donation.donor,
        ngo: ngoId,
        clothesType: donation.clothesType,
        quantity: donation.quantity,
        pickupDate: donation.pickupDate,
        message: donation.message,
        status: "Picked",
      });
      await pickup.save();
      await Donation.findByIdAndDelete(req.params.id);
    }

    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error updating donation", error });
  }
});

module.exports = router;
