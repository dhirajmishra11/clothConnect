import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Help() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-yellow-500"
          >
            Help Center
          </motion.h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions and get support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* FAQs Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-yellow-500 mb-4">
              Frequently Asked Questions
            </h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>How do I make a donation?</li>
              <li>What items can I donate?</li>
              <li>How is my donation used?</li>
              <li>How can I track my donation?</li>
            </ul>
          </motion.div>

          {/* Contact Support */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-yellow-500 mb-4">
              Contact Support
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Need help? Our support team is available 24/7.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-yellow-500 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Contact Us
            </Link>
          </motion.div>

          {/* Resources */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-yellow-500 mb-4">
              Resources
            </h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>User Guide</li>
              <li>Donation Guidelines</li>
              <li>NGO Partnership</li>
              <li>Terms of Service</li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            to="/"
            className="text-yellow-500 hover:text-yellow-600 transition"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Help;