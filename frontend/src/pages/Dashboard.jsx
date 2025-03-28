import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import donorImage from "../images/donor-panel.webp";
import Loader from "../components/Loader";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [totalCollection, setTotalCollection] = useState(0);
  const [yourContribution, setYourContribution] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [donationsRes, collectionRes] = await Promise.all([
          axios.get("/api/donations/my-donations", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/collections", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setDonations(donationsRes.data || []);

        // Calculate total collection
        const total = collectionRes.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setTotalCollection(total);

        // Calculate user's total contribution
        const userTotal = donationsRes.data.reduce((sum, donation) => sum + (donation.quantity || 0), 0);
        setYourContribution(userTotal);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-800 p-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Dashboard</h2>
        <nav className="space-y-4">
          {[
            { label: "My Donations", path: "/my-donations" },
            { label: "New Donation", path: "/new-donation" },
            { label: "Edit Profile", path: "/profile-edit" },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full bg-gray-700 px-4 py-2 rounded text-yellow-300 font-bold hover:bg-gray-600 transition"
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 px-4 py-2 rounded font-bold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Vertical Divider */}
      <div className="w-1 bg-gray-700"></div>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard Header */}
        <header
          className="bg-gray-700 text-white p-6 rounded-lg shadow-md flex items-center justify-between"
          style={{
            backgroundImage: `url(${donorImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        </header>

        {/* Collection Summary */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: "Total Collection", value: totalCollection, color: "text-yellow-400" },
            { title: "Your Contribution", value: yourContribution, color: "text-green-400" },
          ].map(({ title, value, color }) => (
            <div key={title} className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className={`text-2xl font-bold ${color}`}>{value} items</p>
            </div>
          ))}
        </section>

        {/* Donations List */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Your Donations</h2>
          {donations.length === 0 ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-300">You have no donations yet.</p>
              <button
                onClick={() => navigate("/new-donation")}
                className="mt-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded font-bold hover:bg-yellow-500 transition"
              >
                Start Your First Donation
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {donations.map((donation) => (
                <li
                  key={donation._id}
                  className="bg-gray-800 p-4 rounded shadow-md flex justify-between"
                >
                  <span>{donation.clothesType}</span>
                  <span className="font-bold text-green-400">{donation.quantity} items</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
