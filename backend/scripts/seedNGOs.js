const mongoose = require("mongoose");
const NGO = require("../models/NGO");
require("dotenv").config();

const seedNGOs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const ngos = [
      {
        name: "Helping Hands",
        email: "helpinghands@example.com",
        phone: "1234567890",
        address: "123 Charity Lane",
        verified: true,
      },
      {
        name: "Clothes for All",
        email: "clothesforall@example.com",
        phone: "9876543210",
        address: "456 Donation Drive",
        verified: false,
      },
    ];

    await NGO.insertMany(ngos);
    console.log("NGOs seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding NGOs:", error);
    process.exit(1);
  }
};

seedNGOs();
