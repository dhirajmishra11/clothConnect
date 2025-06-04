const User = require("../models/User");
const Donation = require("../models/Donation");
const Collection = require("../models/Collection");
const Pickup = require("../models/Pickup");
const AuditLog = require("../models/AuditLog");

exports.getAnalytics = async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const [users, donations, collections, pickups] = await Promise.all([
      User.find(),
      Donation.find(),
      Collection.find(),
      Pickup.find()
    ]);

    // Calculate user statistics
    const userStats = {
      total: users.length,
      donors: users.filter(u => u.role === 'donor').length,
      ngos: users.filter(u => u.role === 'ngo').length,
      verifiedNGOs: users.filter(u => u.role === 'ngo' && u.verified).length,
      admins: users.filter(u => u.role === 'admin').length
    };

    // Calculate donation statistics
    const donationStats = {
      total: donations.length,
      pending: donations.filter(d => d.status === 'Pending').length,
      accepted: pickups.filter(p => p.status === 'Scheduled').length,
      completed: pickups.filter(p => p.status === 'Picked Up').length,
      totalItems: donations.reduce((sum, d) => sum + (d.quantity || 0), 0)
    };

    // Calculate monthly statistics (last 6 months)
    const monthlyStats = Array(6).fill(0);
    const now = new Date();
    [...donations, ...pickups].forEach(item => {
      const monthDiff = (now.getMonth() + 12 - new Date(item.createdAt).getMonth()) % 12;
      if (monthDiff < 6) {
        monthlyStats[monthDiff] += item.quantity || 0;
      }
    });

    // Calculate collection statistics
    const collectionStats = {
      total: collections.reduce((sum, c) => sum + (c.quantity || 0), 0),
      distributed: collections.reduce((sum, c) => sum + (c.distributed || 0), 0),
      inStock: collections.reduce((sum, c) => sum + ((c.quantity - c.distributed) || 0), 0)
    };

    // Calculate clothes type distribution
    const clothesTypeDistribution = [...donations, ...collections].reduce((acc, item) => {
      if (item.clothesType) {
        acc[item.clothesType] = (acc[item.clothesType] || 0) + (item.quantity || 0);
      }
      return acc;
    }, {});

    res.json({
      userStats,
      donationStats,
      collectionStats,
      monthlyStats,
      clothesTypeDistribution,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      message: "Error fetching analytics",
      error: error.message 
    });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email'),
      AuditLog.countDocuments()
    ]);

    res.json({
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ 
      message: "Error fetching audit logs",
      error: error.message 
    });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    const [donations, collections, pickups] = await Promise.all([
      Donation.find({
        createdAt: { $gte: startDate, $lte: endDate }
      }).populate('donor', 'name'),
      Collection.find({
        createdAt: { $gte: startDate, $lte: endDate }
      }).populate('ngo', 'name'),
      Pickup.find({
        createdAt: { $gte: startDate, $lte: endDate }
      }).populate(['donor', 'ngo'])
    ]);

    const report = {
      period: {
        year,
        month,
        startDate,
        endDate
      },
      summary: {
        totalDonations: donations.length,
        totalItems: donations.reduce((sum, d) => sum + (d.quantity || 0), 0),
        completedPickups: pickups.filter(p => p.status === 'Picked Up').length,
        itemsDistributed: collections.reduce((sum, c) => sum + (c.distributed || 0), 0)
      },
      topDonors: donations.reduce((acc, donation) => {
        const donor = donation.donor?.name || 'Unknown';
        acc[donor] = (acc[donor] || 0) + (donation.quantity || 0);
        return acc;
      }, {}),
      topNGOs: collections.reduce((acc, collection) => {
        const ngo = collection.ngo?.name || 'Unknown';
        acc[ngo] = (acc[ngo] || 0) + (collection.distributed || 0);
        return acc;
      }, {}),
      clothesTypeDistribution: donations.reduce((acc, donation) => {
        if (donation.clothesType) {
          acc[donation.clothesType] = (acc[donation.clothesType] || 0) + (donation.quantity || 0);
        }
        return acc;
      }, {})
    };

    res.json(report);
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({ 
      message: "Error generating monthly report",
      error: error.message 
    });
  }
};
