const Donation = require("../models/Donation");

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

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("user", "name email");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("user", "name email");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const donation = await Donation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
