const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    clothesType: { type: String, required: true },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["Scheduled", "Picked", "Rejected"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);
