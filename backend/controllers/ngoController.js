const User = require("../models/User");
const Donation = require("../models/Donation");
const Pickup = require("../models/Pickup");
const Collection = require("../models/Collection");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const { Parser } = require("json2csv");
const notificationService = require('../utils/notificationService');

// Helper function to verify NGO role
const verifyNGOAuth = (user) => {
  if (!user || user.role !== 'ngo') {
    throw new Error('Unauthorized - NGO access required');
  }
};

exports.createNGO = async (req, res) => {
  try {
    const { name, email, password, phone, address, ngoRegistration } = req.body;
    const ngo = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: "ngo",
      ngoRegistration,
    });
    res.status(201).json(ngo);
  } catch (error) {
    res.status(500).json({ message: "Error creating NGO", error });
  }
};

exports.getNGOs = async (req, res) => {
  try {
    const ngos = await User.find({ role: "ngo" }).select("-password");
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs", error });
  }
};

exports.verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = await User.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    ).select("-password");

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: "Error verifying NGO", error });
  }
};

exports.getNGODonations = async (req, res) => {
  try {
    const donations = await Donation.find({ ngo: req.user._id })
      .sort({ createdAt: -1 })
      .populate("donor", "name email");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    verifyNGOAuth(req.user);
    const { id } = req.params;
    const { status } = req.body;

    const donation = await Donation.findById(id).populate('donor', 'name email');
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    switch (status) {
      case "Accepted":
        // Create pickup record
        const pickup = await Pickup.create({
          donor: donation.donor._id,
          ngo: req.user._id,
          title: donation.title,
          clothesType: donation.clothesType,
          quantity: donation.quantity,
          address: donation.address,
          city: donation.city,
          pincode: donation.pincode,
          phone: donation.phone,
          pickupDate: donation.pickupDate,
          message: donation.message,
          status: "Scheduled"
        });

        // Delete the original donation after creating pickup
        await Donation.findByIdAndDelete(id);

        // Send notification
        await notificationService.sendNotification({
          user: donation.donor._id,
          title: "Donation Accepted",
          message: `Your donation has been accepted by ${req.user.name}`,
          type: "donation_accepted"
        });

        break;

      case "Rejected":
        await Donation.findByIdAndDelete(id);
        await notificationService.sendNotification({
          user: donation.donor._id,
          title: "Donation Rejected",
          message: `Your donation has been rejected by ${req.user.name}`,
          type: "donation_rejected"
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid status" });
    }

    res.json({ message: "Donation status updated successfully" });
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error updating donation status", error: error.message });
    }
  }
};

exports.getNGOAnalytics = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ ngo: req.user._id });
    const pendingDonations = await Donation.countDocuments({
      ngo: req.user._id,
      status: "Pending",
    });
    const completedDonations = await Donation.countDocuments({
      ngo: req.user._id,
      status: "Picked Up",
    });

    res.json({ totalDonations, pendingDonations, completedDonations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
};

exports.assignDonationToTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamMember } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      id,
      { assignedTo: teamMember },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error assigning donation", error });
  }
};

exports.exportDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ ngo: req.user._id });
    const fields = [
      "title",
      "clothesType",
      "quantity",
      "address",
      "city",
      "pincode",
      "status",
      "pickupDate",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(donations);

    res.header("Content-Type", "text/csv");
    res.attachment("donations.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error exporting donations", error });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

exports.getPendingDonations = async (req, res) => {
  try {
    verifyNGOAuth(req.user);
    const donations = await Donation.find({ 
        status: "Pending",
      city: req.user.city // Only show donations in NGO's city
    }).populate("donor", "name email");
    res.json(donations);
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error fetching pending donations", error: error.message });
    }
  }
};

exports.getPickups = async (req, res) => {
  try {
    verifyNGOAuth(req.user);
    const pickups = await Pickup.find({
      ngo: req.user._id,
      status: "Scheduled"
    }).populate("donor", "name email");
    res.json(pickups);
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error fetching pickups", error: error.message });
    }
  }
};

exports.getCollection = async (req, res) => {
  try {
    verifyNGOAuth(req.user);
    const collections = await Collection.find({ 
      ngo: req.user._id 
    }).sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error fetching collection", error: error.message });
    }
  }
};

exports.markAsDonated = async (req, res) => {
  try {
    verifyNGOAuth(req.user);
    const { clothesType, quantity } = req.body;

    if (!clothesType || clothesType.trim() === "") {
      return res.status(400).json({ message: "Clothes type is required" });
    }
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity provided" });
    }

    // Create or update collection record
    let collection = await Collection.findOne({ 
      ngo: req.user._id,
      clothesType 
    });

    if (collection) {
      collection.quantity += parseInt(quantity);
      await collection.save();
    } else {
      collection = await Collection.create({
        ngo: req.user._id,
        clothesType,
        quantity: parseInt(quantity)
      });
    }

    res.json({ message: "Items marked as donated successfully", collection });
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error marking items as donated", error: error.message });
    }
  }
};

exports.distributeCollectionItems = async (req, res) => {
  try {
    verifyNGOAuth(req.user);
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity provided" });
    }

    const collection = await Collection.findOne({ 
      _id: id,
      ngo: req.user._id 
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const availableItems = collection.quantity - collection.distributed;
    if (quantity > availableItems) {
      return res.status(400).json({ 
        message: `Cannot distribute more than available items. Available: ${availableItems}` 
      });
    }

    collection.distributed += parseInt(quantity);
    await collection.save();

    // Log the distribution activity
    await AuditLog.create({
      user: req.user._id,
      action: 'distribute',
      resourceType: 'Collection',
      resourceId: collection._id,
      details: `Distributed ${quantity} items of ${collection.clothesType}`,
      changes: {
        before: { distributed: collection.distributed - quantity },
        after: { distributed: collection.distributed }
      }
    });

    res.json({ 
      message: "Items distributed successfully", 
      collection 
    });
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ 
        message: "Error distributing items", 
        error: error.message 
      });
    }
  }
};
