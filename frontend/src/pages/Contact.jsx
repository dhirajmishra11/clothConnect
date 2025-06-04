import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-yellow-500"
          >
            Contact Us
          </motion.h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Get in touch with our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-yellow-500 mb-6">
              Send us a Message
            </h2>
            {success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 text-center py-8"
              >
                Thank you for your message! We'll get back to you soon.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-black rounded border focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-black rounded border focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-black rounded border focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 text-black rounded border focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-600 transition"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-yellow-500 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FaPhone className="text-yellow-500 text-xl mr-4" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FaEnvelope className="text-yellow-500 text-xl mr-4" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>support@clothconnect.com</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="text-yellow-500 text-xl mr-4" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p>123 Charity Lane<br />Donation City, DC 12345</p>
                </div>
              </div>
            </div>
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

export default Contact;