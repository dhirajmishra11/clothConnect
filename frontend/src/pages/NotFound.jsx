import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/common/Button";

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="text-9xl font-bold text-primary-500 dark:text-primary-400"
        >
          404
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-4 text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl"
        >
          Page not found
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-lg text-gray-600 dark:text-gray-300"
        >
          Sorry, we couldn't find the page you're looking for. Perhaps you've
          mistyped the URL? Be sure to check your spelling.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 space-y-4"
        >
          <Link to="/">
            <Button variant="primary" className="w-full sm:w-auto">
              Go back home
            </Button>
          </Link>

          <div className="flex justify-center space-x-4">
            <Link to="/contact">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
            >
              Go back
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex justify-center space-x-4"
        >
          <Link
            to="/donations"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            View Donations
          </Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Do Donations
          </Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link
            to="/help"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Help Center
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;
