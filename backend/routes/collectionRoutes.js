const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Collection = require("../models/Collection");

const router = express.Router();

// Fetch all collections
router.get("/", protect, async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collections", error });
  }
});

module.exports = router;
