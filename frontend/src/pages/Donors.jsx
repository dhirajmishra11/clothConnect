import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUserCheck, FiMail, FiXCircle } from "react-icons/fi";

function Donors() {
  const { token } = useSelector((state) => state.auth);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonors(response.data.filter((user) => user.role === "donor"));
      } catch (error) {
        toast.error("Failed to fetch donors.");
      }
    };
    fetchDonors();
  }, [token]);

  const handleDeactivate = async (donorId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/users/${donorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonors((prev) => prev.filter((donor) => donor._id !== donorId));
      toast.success("Donor deactivated successfully!");
    } catch (error) {
      toast.error("Failed to deactivate donor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 text-yellow-500">Donors</h1>
      {donors.length === 0 ? (
        <p className="text-center text-gray-400">No donors found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <div key={donor._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <FiUserCheck className="text-yellow-500 text-2xl mr-2" />
                <h2 className="text-xl font-semibold">{donor.name}</h2>
              </div>
              <p className="flex items-center text-gray-300">
                <FiMail className="mr-2" /> {donor.email}
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setSelectedDonor(donor)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeactivate(donor._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  disabled={loading}
                >
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-yellow-500">
              {selectedDonor.name}
            </h3>
            <p>Email: {selectedDonor.email}</p>
            <p>Role: {selectedDonor.role}</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setSelectedDonor(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
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

export default Donors;