import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import adminImage from "../images/admin-panel.webp";
import "tailwindcss/tailwind.css";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCollection, setTotalCollection] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/api/donations/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(response.data);
        const total = response.data.reduce((sum, donation) => sum + donation.quantity, 0);
        setTotalCollection(total);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [token]);

  if (loading) return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.header
        className="bg-cover bg-center text-center py-24 shadow-lg"
        style={{ backgroundImage: `url(${adminImage})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold bg-black bg-opacity-60 p-4 rounded-lg inline-block">
          Welcome, {user?.name}
        </h1>
      </motion.header>

      <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        <motion.div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center" whileHover={{ scale: 1.05 }}>
          <h2 className="text-2xl font-semibold">Total Collection</h2>
          <p className="text-4xl font-bold text-green-400">{totalCollection}</p>
        </motion.div>
        <motion.div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center" whileHover={{ scale: 1.05 }}>
          <h2 className="text-2xl font-semibold">Your Contribution</h2>
          <p className="text-4xl font-bold text-blue-400">{totalCollection}</p>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Recent Donations</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <ul className="space-y-4">
            {donations.map((donation) => (
              <motion.li
                key={donation._id}
                className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-lg font-semibold">{donation.items}</span>
                <span className="text-gray-400">{donation.status}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex space-x-4">
        <button onClick={() => navigate("/admin/donors")} className="bg-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">Donors</button>
        <button onClick={() => navigate("/admin/ngos")} className="bg-green-600 px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition">NGOs</button>
        <button onClick={() => dispatch(logout())} className="bg-red-600 px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition">Logout</button>
      </div>
    </div>
  );
}

export default AdminDashboard;