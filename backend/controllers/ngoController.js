const NGO = require("../models/NGO");
const Donation = require("../models/Donation");
const Notification = require("../models/Notification");
const { Parser } = require("json2csv");
const Pickup = require("../models/Pickup"); // Import the Pickup model
const Collection = require("../models/Collection"); // Import the Collection model

exports.createNGO = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const ngo = await NGO.create({ name, email, phone, address });
    res.status(201).json(ngo);
  } catch (error) {
    res.status(500).json({ message: "Error creating NGO", error });
  }
};

exports.getNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs", error });
  }
};

exports.verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = await NGO.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: "Error verifying NGO", error });
  }
};

exports.getNGODonations = async (req, res) => {
  try {
    const donations = await Donation.find({ ngo: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the donation
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // If the donation is accepted, move it to the pickups collection
    if (status === "Accepted") {
      await Pickup.create({
        donor: donation.donor,
        ngo: req.user._id,
        title: donation.title, // Ensure title is transferred
        clothesType: donation.clothesType,
        quantity: donation.quantity,
        address: donation.address, // Ensure address is transferred
        city: donation.city,
        pincode: donation.pincode,
        phone: donation.phone,
        pickupDate: donation.pickupDate,
        message: donation.message,
        status: "Scheduled",
      });
    }

    // Delete the donation after transferring to pickups
    await donation.deleteOne();

    res.json({ message: "Donation status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating donation status", error });
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
    const donations = await Donation.find({ status: "Pending" });
    res.json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending donations", error });
  }
};

exports.getPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      ngo: req.user._id,
      status: "Scheduled",
    });
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pickups", error });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const donations = await Donation.find({
      ngo: req.user._id,
      status: "Picked Up",
    });
    const aggregatedData = donations.reduce((acc, donation) => {
      acc[donation.clothesType] =
        (acc[donation.clothesType] || 0) + donation.quantity;
      return acc;
    }, {});
    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collection", error });
  }
};

exports.markAsDonated = async (req, res) => {
  try {
    const { clothesType, quantity } = req.body;

    if (!clothesType || clothesType.trim() === "") {
      return res.status(400).json({ message: "Clothes type is required" });
    }
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity provided" });
    }

    const collection = await Collection.findOne({ clothesType });

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Clothes type not found in collection" });
    }

    if (collection.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Not enough clothes in collection" });
    }

    collection.quantity -= quantity;
    await collection.save();

    res.json({ message: "Clothes marked as donated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking clothes as donated", error });
  }
};
