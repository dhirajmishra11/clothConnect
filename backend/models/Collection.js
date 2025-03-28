const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    clothesType: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
