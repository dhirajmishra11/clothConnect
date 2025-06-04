const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

const generateToken = (id, expiresIn = '30d') => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role, phone, address, city, ngoRegistration } = req.body;
  
  try {
    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // Create user with all provided fields
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "donor",
      phone,
      address,
      city,
      ...(role === "ngo" && { ngoRegistration }),
    });

    // Generate verification token and send email
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();
    
    try {
      await sendVerificationEmail(user.email, verificationToken);
      res.status(201).json({ 
        message: "Registration successful. Please verify your email." 
      });
    } catch (emailError) {
      // If email sending fails, still create the account but inform the user
      console.error("Email sending failed:", emailError);
      res.status(201).json({ 
        message: "Registration successful, but verification email could not be sent. Please contact support." 
      });
    }
  } catch (error) {
    res.status(400).json({ 
      message: "Registration failed", 
      error: error.message 
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password, twoFactorCode } = req.body;
  
  try {
    // Find user and include password field for validation
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    // Handle 2FA if enabled
    if (user.isTwoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(403).json({
          message: "2FA code required",
          requires2FA: true
        });
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: twoFactorCode,
        window: 1 // Allow 30 seconds window
      });

      if (!isValid) {
        return res.status(401).json({ message: "Invalid 2FA code" });
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send successful response without password
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Login failed", 
      error: error.message 
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

exports.setup2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `ClothConnect:${req.user.email}`
    });

    req.user.twoFactorSecret = secret.base32;
    await req.user.save();

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ message: "Error setting up 2FA", error: error.message });
  }
};

exports.verify2FA = async (req, res) => {
  const { token } = req.body;

  try {
    const isValid = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!isValid) {
      return res.status(401).json({ message: "Invalid verification code" });
    }

    req.user.isTwoFactorEnabled = true;
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex')
    );
    req.user.twoFactorBackupCodes = backupCodes;
    await req.user.save();

    res.json({ 
      message: "2FA enabled successfully",
      backupCodes 
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying 2FA", error: error.message });
  }
};

exports.disable2FA = async (req, res) => {
  try {
    req.user.isTwoFactorEnabled = false;
    req.user.twoFactorSecret = undefined;
    req.user.twoFactorBackupCodes = undefined;
    await req.user.save();

    res.json({ message: "2FA disabled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error disabling 2FA", error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Clear user's session or token if needed
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // Don't allow password update through this route
    delete updates.role; // Don't allow role update through this route
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

console.log("getUserById:", exports.getUserById);



exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};



exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

exports.bulkUpdateUsers = async (req, res) => {
  try {
    const { users } = req.body;
    const updates = await Promise.all(
      users.map(async ({ id, ...updates }) => {
        delete updates.password; // Don't allow password updates
        const user = await User.findByIdAndUpdate(
          id,
          updates,
          { new: true, runValidators: true }
        ).select("-password");
        return user;
      })
    );
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: "Error updating users", error: error.message });
  }
};

exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    await User.deleteMany({ _id: { $in: userIds } });
    res.json({ message: "Users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting users", error: error.message });
  }
};
