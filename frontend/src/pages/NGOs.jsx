import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiTrash2, FiX } from "react-icons/fi";

function NGOs() {
  const { token } = useSelector((state) => state.auth);
  const [ngos, setNGOs] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await axios.get("/api/ngos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNGOs(response.data);
      } catch (error) {
        console.error("Error fetching NGOs:", error.response || error);
        toast.error("Failed to fetch NGOs.");
      }
    };

    fetchNGOs();
  }, [token]);

  const handleDeactivate = async (ngoId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/users/${ngoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNGOs((prev) => prev.filter((ngo) => ngo._id !== ngoId));
      toast.success("NGO deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating NGO:", error.response || error);
      toast.error("Failed to deactivate NGO.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 text-yellow-500">NGOs</h1>
      {ngos.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No NGOs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo) => (
            <div
              key={ngo._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                <p className="font-bold text-lg text-white">Name: {ngo.name}</p>
                <p className="text-gray-300">Email: {ngo.email}</p>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setSelectedNGO(ngo)}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  <FiEye className="mr-2" /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Viewing NGO Details */}
      {selectedNGO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition"
              onClick={() => setSelectedNGO(null)}
            >
              <FiX size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-yellow-500">
              {selectedNGO.name}
            </h3>
            <p className="mb-2">Email: {selectedNGO.email}</p>
            <p className="mb-4">Role: {selectedNGO.role}</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => handleDeactivate(selectedNGO._id)}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                disabled={loading}
              >
                <FiTrash2 className="mr-2" /> Deactivate
              </button>
              <button
                onClick={() => setSelectedNGO(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
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

export default NGOs;
