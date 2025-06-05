const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://clothconnect.onrender.com'
  ],
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

// Import Routes
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const impactRoutes = require("./routes/impactRoutes");
const adminRoutes = require("./routes/adminRoutes");

// MongoDB Connection with improved error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Mount API Routes with proper prefixes
app.get("/", (_, res) => {
  res.send("Welcome to ClothConnect API");
});

app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes); // Mount admin routes before analytics
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/impact", impactRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Handle 404 - API routes not found
app.use("/api/*", (req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
