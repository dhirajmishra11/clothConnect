import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

function MyDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axiosInstance.get("/donations/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setError("Failed to fetch donations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDonations();
    }
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <h1 className="text-4xl font-bold text-yellow-500 text-center mb-6">
        My Donations
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {donations.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-400">No donations found.</p>
          <button
            className="mt-4 bg-yellow-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={() => (window.location.href = "/new-donation")}
          >
            Make Your First Donation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-yellow-400">
                {donation.title || "N/A"}
              </h2>
              <p className="text-gray-300">
                Clothes Type:{" "}
                <span className="text-white">
                  {donation.clothesType || "N/A"}
                </span>
              </p>
              <p className="text-gray-300">
                Quantity:{" "}
                <span className="text-white">{donation.quantity || "N/A"}</span>
              </p>
              <p
                className={`font-bold ${
                  donation.status?.toLowerCase() === "picked"
                    ? "text-green-500"
                    : donation.status?.toLowerCase() === "scheduled"
                    ? "text-pink-600"
                    : "text-red-500"
                }`}
              >
                Status: {donation.status || "Pending"}
              </p>
              {donation.pickupDate && (
                <p className="text-gray-300">
                  Pickup Date:{" "}
                  <span className="text-white">
                    {new Date(donation.pickupDate).toLocaleDateString()}
                  </span>
                </p>
              )}
              {donation.message && (
                <p className="text-gray-300">
                  Message:{" "}
                  <span className="text-white">{donation.message}</span>
                </p>
              )}
              {donation.ngo && (
                <p className="text-gray-300">
                  NGO:{" "}
                  <span className="text-white">
                    {donation.ngo.name || "N/A"}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDonations;
