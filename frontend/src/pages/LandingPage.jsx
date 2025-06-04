import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FloatingWindow } from "../components/FloatingWindow";
import { Button } from "../components/common/Button";
import heroImage from "../images/landing-hero.webp";
import logo from "../images/logo.webp";

const features = [
  {
    title: "Easy Donation Process",
    description:
      "Quick and simple way to donate your clothes to those in need",
    icon: "🎁",
  },
  {
    title: "Verified NGOs",
    description:
      "Partner with trusted organizations to ensure your donations reach the right people",
    icon: "✅",
  },
  {
    title: "Track Impact",
    description: "See how your donations are making a difference in the community",
    icon: "📊",
  },
  {
    title: "Scheduled Pickups",
    description: "Convenient door-to-door collection of your donations",
    icon: "🚚",
  },
];

function LandingPage() {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showFloatingWindow, setShowFloatingWindow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lines = [
    "From Your Closet to Those in Need.",
    "Help by donating your old clothes.",
    "Don't throw your old clothes, donate them.",
    "Together, we can make a difference.",
    "Every donation matters – start today!",
  ];

  useEffect(() => {
    let charIndex = 0;
    let tempText = "";
    const typeLine = () => {
      if (charIndex < lines[currentLine].length) {
        tempText += lines[currentLine][charIndex];
        setDisplayedText(tempText);
        charIndex++;
        setTimeout(typeLine, 75);
      } else {
        setTimeout(() => {
          setDisplayedText("");
          setCurrentLine((prev) => (prev + 1) % lines.length);
        }, 2000);
      }
    };
    typeLine();
  }, [currentLine]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/75" />
        </div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-display font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Making Clothes Donation
              <span className="block text-primary-200">Simple and Impactful</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-primary-100">
              Connect with trusted NGOs and make a difference in your community
              through clothing donations.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center sm:space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register">
                  <Button size="lg" variant="primary">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="mt-3 sm:mt-0">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              Why Choose ClothConnect?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We make it easy to donate clothes and track your impact
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-2xl">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-display font-bold text-white sm:text-4xl">
              Ready to Make a Difference?
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-200">
              Start your donation journey today and help those in need.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50"
                >
                  Join ClothConnect Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-300 p-8 border-t border-gray-600 shadow-lg">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            {[
              {
                icon: FaInstagram,
                label: "Instagram",
                link: "https://www.instagram.com",
              },
              {
                icon: FaFacebook,
                label: "Facebook",
                link: "https://www.facebook.com",
              },
              {
                icon: FaYoutube,
                label: "YouTube",
                link: "https://www.youtube.com",
              },
            ].map(({ icon: Icon, label, link }) => (
              <a
                key={label}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 justify-center hover:text-yellow-400 transition duration-300"
              >
                <Icon className="text-xl" />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p className="flex items-center justify-center space-x-2">
              <FaPhone className="text-green-400" />
              <span>+91 91579 65117</span>
            </p>
            <p className="flex items-center justify-center space-x-2">
              <FaEnvelope className="text-red-400" />
              <span>support@clothconnect.com</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
