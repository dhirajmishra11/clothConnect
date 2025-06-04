const Donation = require("../models/Donation");
const Pickup = require("../models/Pickup");

exports.createDonation = async (req, res) => {
  try {
    const {
      clothesType,
      quantity,
      address,
      city,
      pincode,
      title,
      phone,
      pickupDate,
      message,
    } = req.body;

    if (
      !clothesType ||
      !quantity ||
      !address ||
      !city ||
      !pincode ||
      !title ||
      !phone ||
      !pickupDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const donation = new Donation({
      donor: req.user._id,
      clothesType,
      quantity,
      address,
      city,
      pincode,
      title,
      phone,
      pickupDate,
      message,
    });

    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error creating donation", error });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id });
    const pickups = await Pickup.find({ donor: req.user._id });
    res.json([...donations, ...pickups]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email")
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ngoId } = req.body;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (!ngoId || req.user._id.toString() !== ngoId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    donation.status = status;
    donation.ngo = ngoId;
    await donation.save();

    if (status === "Accepted") {
      const pickup = new Pickup({
        donor: donation.donor,
        ngo: ngoId,
        clothesType: donation.clothesType,
        quantity: donation.quantity,
        address: donation.address,
        city: donation.city,
        pincode: donation.pincode,
        phone: donation.phone,
        pickupDate: donation.pickupDate,
        message: donation.message,
        title: donation.title,
        status: "Scheduled",
      });
      await pickup.save();
      await Donation.findByIdAndDelete(id);
    }

    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Error updating donation", error });
  }
};

exports.getPublicDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .select("-donor -phone -address -message")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public donations", error });
  }
};
