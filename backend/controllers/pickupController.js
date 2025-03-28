const Pickup = require("../models/Pickup");
const Collection = require("../models/Collection"); // Import the Collection model

exports.createPickup = async (req, res) => {
  try {
    const { address, pickupDate } = req.body;
    const pickup = await Pickup.create({
      donor: req.user._id,
      address,
      pickupDate,
    });
    res.status(201).json(pickup);
  } catch (error) {
    res.status(500).json({ message: "Error creating pickup request", error });
  }
};

exports.getPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find().populate("donor", "name email");
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pickup requests", error });
  }
};

exports.updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the pickup
    const pickup = await Pickup.findById(id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    // Update the pickup status
    pickup.status = status;
    await pickup.save();

    // If the status is "Picked", update the collections collection
    if (status === "Picked") {
      const { clothesType, quantity } = pickup;

      // Check if the clothes type already exists in the collections collection
      const existingCollection = await Collection.findOne({ clothesType });

      if (existingCollection) {
        // Update the quantity if the clothes type exists
        existingCollection.quantity += quantity;
        await existingCollection.save();
      } else {
        // Create a new entry if the clothes type does not exist
        await Collection.create({ clothesType, quantity });
      }
    }

    res.json({ message: `Pickup status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating pickup status", error });
  }
};
