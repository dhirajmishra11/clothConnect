const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createPickup,
  getPickups,
  updatePickupStatus,
} = require("../controllers/pickupController");

const router = express.Router();

router.post("/", protect, createPickup);
router.get("/", protect, getPickups);
router.put("/:id", protect, updatePickupStatus);

module.exports = router;
