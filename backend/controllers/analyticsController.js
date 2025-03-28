const User = require("../models/User");
const Donation = require("../models/Donation");
const AuditLog = require("../models/AuditLog");

exports.getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalDonations] = await Promise.all([
      User.countDocuments(),
      Donation.countDocuments(),
    ]);
    res.json({ totalUsers, totalDonations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

exports.getDonationAnalytics = async (req, res) => {
  try {
    const donationStats = await Donation.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(donationStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donation analytics" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = await User.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: "Error verifying NGO", error });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching audit logs", error });
  }
};

exports.generateMonthlyReport = async (req, res) => {
  try {
    const report = {
      totalUsers: await User.countDocuments(),
      totalDonations: await Donation.countDocuments(),
      activeNGOs: await User.countDocuments({ role: "ngo", verified: true }),
    };
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Error generating monthly report", error });
  }
};
