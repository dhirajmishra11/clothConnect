import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Loader;
