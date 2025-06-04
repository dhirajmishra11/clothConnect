const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  setup2FA,
  verify2FA,
  disable2FA,
  refreshToken,
  logout,
  updateProfile,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  bulkUpdateUsers,
  bulkDeleteUsers,
} = require("../controllers/userController");

// Rate limiting setup
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: "Too many login attempts, please try again after 15 minutes",
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 email requests per hour
  message: "Too many email requests, please try again after an hour",
});

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/verify-email/:token", verifyEmail); // Support URL parameter
router.get("/verify-email", verifyEmail); // Support query parameter
router.post("/forgot-password", emailLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout); // Fixed: Added logout handler

// 2FA routes
router.post("/2fa/setup", protect, setup2FA);
router.post("/2fa/verify", protect, verify2FA);
router.post("/2fa/disable", protect, disable2FA);

// Protected user routes
router.route("/profile")
  .get(protect, getUserById)
  .put(protect, updateProfile)
  .delete(protect, deleteAccount);

// Admin only routes
router.use(protect, authorize("admin"));

router.route("/users")
  .get(getAllUsers)
  .post(bulkUpdateUsers)
  .delete(bulkDeleteUsers);

router.route("/users/:id")
  .get(getUserById)
  .put(updateUserRole)
  .delete(deleteUser);

module.exports = router;
