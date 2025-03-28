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
import FloatingWindow from "../components/FloatingWindow";
import heroImage from "../images/landing-hero.webp";
import logo from "../images/logo.webp";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white flex flex-col">
      <header className="p-6 flex justify-between items-center border-b border-gray-700 shadow-md backdrop-blur-lg bg-opacity-10 relative">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 rounded-full shadow-lg"
          />
          <h1 className="text-3xl font-extrabold text-yellow-400 tracking-widest">
            ClothConnect
          </h1>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none z-50 transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* Drawer */}
        <div
          className={`fixed md:hidden top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-3/4 bg-gray-900 bg-opacity-95 z-50 rounded-lg shadow-lg transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          } `}
        >
          <div className="flex flex-col items-center justify-center space-y-6 p-6">
            {/* Close Button */}
            <button
              className="text-white text-3xl self-end mb-6 transition-transform duration-300"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes />
            </button>

            {/* Navigation Links Inside Drawer */}
            {["-","-","Home", "Register", "Login", "About Us", "Description"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.replace(/ /g, "-").toLowerCase()}`}
                  className="block w-40 text-center text-lg px-4 py-2 bg-gray-800 text-gray-300 hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          className={`z-50 md:static bg-transparent rounded-lg md:flex p-4 md:p-0 hidden`}
        >
          {["Home", "Register", "Login", "About Us", "Description"].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.replace(/ /g, "-").toLowerCase()}`}
                className="block md:inline-block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-all duration-300"
              >
                {item === "Landing" ? "Home" : item}
              </Link>
            )
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <motion.h2
          className="text-5xl font-bold text-yellow-400 mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Every Donation Matters.
        </motion.h2>
        <motion.p
          className="text-lg text-gray-300 mb-8 max-w-2xl italic tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {displayedText}
        </motion.p>
        <motion.div
          className="space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/register"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 hover:scale-105 transform transition-all duration-300 font-bold"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-black px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 hover:scale-105 transform transition-all duration-300 font-bold"
          >
            Login
          </Link>
        </motion.div>
        <motion.img
          src={heroImage}
          alt="Hero"
          className="mt-8 rounded-xl shadow-lg w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
      </main>

      {/* Responsive Donation Button */}
      <button
        onClick={() => setShowFloatingWindow(!showFloatingWindow)}
        className="absolute top-[128vh] left-[52.4%] transform -translate-x-1/4 -translate-y-1/2 w-40 h-12 bg-yellow-500 text-black font-bold text-2xl rounded-lg shadow-lg flex flex-col items-center p-2 text-center hover:bg-yellow-400 transition duration-300 hidden md:block"
      >
        Donation
      </button>
      {showFloatingWindow && <FloatingWindow />}

      {/* How It Works Section */}
      <section className="bg-gray-200 py-16 text-center">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-violet-900 mb-8">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Register", "Connect", "Make a Difference"].map((step, index) => (
              <div
                key={step}
                className="p-6 bg-violet-700 text-white rounded shadow-md hover:scale-105 transform transition duration-300"
              >
                <h4 className="text-xl font-bold mb-4">
                  Step {index + 1}: {step}
                </h4>
                <p>
                  {index === 0
                    ? "Create an account as a Donor, NGO, or Admin."
                    : index === 1
                    ? "Donors can donate, NGOs manage donations, and Admins oversee activities."
                    : "Together, we can create a better world."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-gray-800 py-16 text-center">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-yellow-400">
            Our Mission
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Empowering Communities",
              "Building Trust",
              "Fostering Collaboration",
            ].map((mission, index) => (
              <div
                key={mission}
                className="p-6 bg-yellow-400 text-indigo-900 rounded shadow-md hover:scale-105 transform transition duration-300"
              >
                <h4 className="text-xl font-bold mb-4">{mission}</h4>
                <p>
                  {index === 0
                    ? "We connect resources with those in need to create a better society."
                    : index === 1
                    ? "We ensure transparency and accountability in all operations."
                    : "We unite donors, NGOs, and admins to work towards a common goal."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
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
