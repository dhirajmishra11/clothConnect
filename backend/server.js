const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Import Routes
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes"); // Ensure this is a valid route
const ngoRoutes = require("./routes/ngoRoutes"); // Ensure this is a valid route
const pickupRoutes = require("./routes/pickupRoutes"); // Ensure this is a valid route
const collectionRoutes = require("./routes/collectionRoutes"); // Import the collection routes

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to ClothConnect API");
});

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", analyticsRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/collections", collectionRoutes); // Register the collection routes

// Handle unmatched API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000; // Ensure the port is set correctly
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
