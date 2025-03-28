import React from "react";
import { motion } from "framer-motion";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8 flex flex-col items-center justify-center">
    <motion.h1
      className="text-5xl font-bold text-yellow-400 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      About Us
    </motion.h1>
    <motion.p
      className="text-lg text-gray-300 max-w-3xl text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      ClothConnect is a platform dedicated to connecting donors, NGOs, and administrators to create a better society. Our mission is to ensure
        that resources reach those in need efficiently and transparently.
      </motion.p>
    </div>
  );
}

export default AboutUs;
