import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiCheckCircle, FiX, FiXCircle } from "react-icons/fi";

function PendingDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingDonations = async () => {
      try {
        const response = await axios.get("/api/ngos/pending-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching pending donations:", error.response || error);
        toast.error("Failed to fetch pending donations.");
      }
    };

    fetchPendingDonations();
  }, [token]);

  const handleAccept = async (donationId) => {
    setLoading(true);
    try {
      await axios.put(
        `/api/ngos/donations/${donationId}`,
        { status: "Accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) => prev.filter((donation) => donation._id !== donationId));
      toast.success("Donation accepted successfully!");
    } catch (error) {
      console.error("Error accepting donation:", error);
      toast.error("Failed to accept donation.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (donationId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/ngos/donations/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations((prev) => prev.filter((donation) => donation._id !== donationId));
      toast.success("Donation rejected successfully!");
    } catch (error) {
      console.error("Error rejecting donation:", error);
      toast.error("Failed to reject donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 text-yellow-500">Pending Donations</h1>
      {donations.length === 0 ? (
        <p className="text-center text-gray-400">No pending donations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                <p className="font-bold text-xl">{donation.title}</p>
                <p className="text-gray-300">Clothes Type: {donation.clothesType}</p>
                <p className="text-gray-300">Quantity: {donation.quantity}</p>
                <p className="text-gray-300">Address: {donation.address}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedDonation(donation)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  disabled={loading}
                >
                  <FiEye className="mr-2" /> Open
                </button>
                <button
                  onClick={() => handleAccept(donation._id)}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                  disabled={loading}
                >
                  <FiCheckCircle className="mr-2" /> Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Viewing Donation Details */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition"
              onClick={() => setSelectedDonation(null)}
            >
              <FiX size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-yellow-500">
              {selectedDonation.title}
            </h3>
            <p className="text-gray-300">Clothes Type: {selectedDonation.clothesType}</p>
            <p className="text-gray-300">Quantity: {selectedDonation.quantity}</p>
            <p className="text-gray-300">Address: {selectedDonation.address}</p>
            <p className="text-gray-300">City: {selectedDonation.city}</p>
            <p className="text-gray-300">Pincode: {selectedDonation.pincode}</p>
            <p className="text-gray-300">Phone: {selectedDonation.phone}</p>
            <p className="text-gray-300">
              Pickup Date: {new Date(selectedDonation.pickupDate).toDateString()}
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => handleReject(selectedDonation._id)}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                disabled={loading}
              >
                <FiXCircle className="mr-2" /> Reject
              </button>
              <button
                onClick={() => handleAccept(selectedDonation._id)}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                disabled={loading}
              >
                <FiCheckCircle className="mr-2" /> Accept
              </button>
              <button
                onClick={() => setSelectedDonation(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingDonations;
