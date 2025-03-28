import React from "react";
import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800">
      <motion.div
        className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </div>
  );
}

export default Loader;
