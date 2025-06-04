const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["donor", "ngo", "admin"], default: "donor" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    twoFactorSecret: String,
    isTwoFactorEnabled: { type: Boolean, default: false },
    twoFactorBackupCodes: [String],
    lastPasswordChange: Date,
    // Additional fields for NGOs
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    ngoRegistration: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.lastPasswordChange = Date.now();
  next();
});

// Password validation method
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

module.exports = mongoose.model("User", userSchema);
