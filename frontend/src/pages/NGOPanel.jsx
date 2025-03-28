import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ngoImage from "../images/ngo-panel.webp";
import { logout } from "../store/slices/authSlice";
import { FiLogOut, FiCalendar, FiTruck, FiInbox, FiCheckCircle } from "react-icons/fi";

function NGOPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchNGOData() {
      try {
        const response = await fetch("/api/ngo/dashboard");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching NGO data:", error);
      }
    }
    fetchNGOData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${ngoImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative text-center">
          <h1 className="text-5xl font-bold text-yellow-400 bg-gray-800 bg-opacity-75 px-6 py-3 rounded-lg shadow-lg">
            NGO Dashboard - {user?.name || "Welcome"}
          </h1>
          <p className="mt-4 text-lg text-yellow-300">Manage donations efficiently</p>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center border-t border-b border-yellow-500 py-4 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:space-x-4 w-full md:w-auto space-y-2 md:space-y-0">
            <button
              onClick={() => navigate("/ngo/pending-donations")}
              className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded transition duration-300"
            >
              <FiCalendar className="mr-2" /> Pending Donations
            </button>
            <button
              onClick={() => navigate("/ngo/pickups")}
              className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded transition duration-300"
            >
              <FiTruck className="mr-2" /> Pickups
            </button>
            <button
              onClick={() => navigate("/ngo/collection")}
              className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded transition duration-300"
            >
              <FiInbox className="mr-2" /> Collection
            </button>
            <button
              onClick={() => navigate("/ngo/donated")}
              className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded transition duration-300"
            >
              <FiCheckCircle className="mr-2" /> Donated
            </button>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition duration-300"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default NGOPanel;
