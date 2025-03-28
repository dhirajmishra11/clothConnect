import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiCheckCircle, FiX, FiXCircle } from "react-icons/fi";

function Pickups() {
  const { token } = useSelector((state) => state.auth);
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axiosInstance.get("/ngos/pickups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPickups(response.data);
      } catch (error) {
        console.error("Error fetching pickups:", error);
        toast.error("Failed to fetch pickups.");
      }
    };

    fetchPickups();
  }, [token]);

  const handlePicked = async (pickupId) => {
    setLoading(true);
    try {
      await axiosInstance.put(
        `/pickups/${pickupId}`,
        { status: "Picked" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPickups((prev) => prev.filter((pickup) => pickup._id !== pickupId));
      toast.success("Pickup marked as completed!");
    } catch (error) {
      console.error("Error marking pickup as completed:", error);
      toast.error("Failed to mark pickup as completed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (pickupId) => {
    setLoading(true);
    try {
      await axiosInstance.put(
        `/pickups/${pickupId}`,
        { status: "Rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPickups((prev) => prev.filter((pickup) => pickup._id !== pickupId));
      toast.success("Pickup rejected successfully!");
    } catch (error) {
      console.error("Error rejecting pickup:", error);
      toast.error("Failed to reject pickup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 text-yellow-500">Pickups</h1>
      {pickups.length === 0 ? (
        <p className="text-center text-gray-400">No pickups found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pickups.map((pickup) => (
            <div
              key={pickup._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                <p className="font-bold text-xl">{pickup.title}</p>
                <p className="text-gray-300">
                  Clothes Type: {pickup.clothesType}
                </p>
                <p className="text-gray-300">Quantity: {pickup.quantity}</p>
                <p className="text-gray-300">Address: {pickup.address}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedPickup(pickup)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  disabled={loading}
                >
                  <FiEye className="mr-2" /> Open
                </button>
                <button
                  onClick={() => handlePicked(pickup._id)}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                  disabled={loading}
                >
                  <FiCheckCircle className="mr-2" /> Picked
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Viewing Pickup Details */}
      {selectedPickup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition"
              onClick={() => setSelectedPickup(null)}
            >
              <FiX size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-yellow-500">
              {selectedPickup.title}
            </h3>
            <p className="text-gray-300">
              Clothes Type: {selectedPickup.clothesType}
            </p>
            <p className="text-gray-300">Quantity: {selectedPickup.quantity}</p>
            <p className="text-gray-300">Address: {selectedPickup.address}</p>
            <p className="text-gray-300">City: {selectedPickup.city}</p>
            <p className="text-gray-300">Pincode: {selectedPickup.pincode}</p>
            <p className="text-gray-300">Phone: {selectedPickup.phone}</p>
            <p className="text-gray-300">
              Pickup Date: {new Date(selectedPickup.pickupDate).toDateString()}
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => handleReject(selectedPickup._id)}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                disabled={loading}
              >
                <FiXCircle className="mr-2" /> Reject
              </button>
              <button
                onClick={() => handlePicked(selectedPickup._id)}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                disabled={loading}
              >
                <FiCheckCircle className="mr-2" /> Picked
              </button>
              <button
                onClick={() => setSelectedPickup(null)}
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

export default Pickups;
