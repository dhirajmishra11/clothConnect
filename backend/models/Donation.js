const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clothesType: { type: String, required: true },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Picked Up"],
      default: "Pending",
    },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Store the NGO that accepted the donation
    title: { type: String, required: true },
    phone: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    message: { type: String }, // Updated field name
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Donation", donationSchema);
