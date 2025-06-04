const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clothesType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    distributed: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["In Stock", "Distributed", "In Process"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
