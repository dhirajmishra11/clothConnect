const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getUserImpact } = require("../controllers/impactController");

const router = express.Router();

router.get("/user", protect, getUserImpact);

module.exports = router;