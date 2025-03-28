import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import adminImage from "../images/admin-panel.webp";
import { FiLogOut, FiUsers, FiTrendingUp } from "react-icons/fi";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [totalCollection, setTotalCollection] = useState(0);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get("/api/collections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalQuantity = response.data.reduce((sum, item) => sum + item.quantity, 0);
        setTotalCollection(totalQuantity);
      } catch (error) {
        console.error("Error fetching collection data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <ToastContainer />
      <header className="relative h-60 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${adminImage})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-4xl font-bold text-yellow-400 bg-gray-800 px-6 py-3 rounded-lg shadow-lg">
          Welcome, {user?.name}
        </h1>
      </header>

      <div className="container mx-auto px-6 mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Total Collection</h2>
              <p className="text-xl font-semibold mt-2">{totalCollection} items</p>
            </div>
            <FiTrendingUp className="text-yellow-400 text-4xl" />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Manage Donors</h2>
              <button onClick={() => navigate("/admin/donors")} className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition">
                View Donors
              </button>
            </div>
            <FiUsers className="text-yellow-400 text-4xl" />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Manage NGOs</h2>
              <button onClick={() => navigate("/admin/ngos")} className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition">
                View NGOs
              </button>
            </div>
            <FiUsers className="text-yellow-400 text-4xl" />
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button onClick={() => dispatch(logout())} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition">
            <FiLogOut className="text-xl" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;