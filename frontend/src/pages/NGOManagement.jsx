import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function NGOManagement() {
  const { token } = useSelector((state) => state.auth);
  const [ngos, setNGOs] = useState([]);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await axios.get("/api/ngos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNGOs(response.data);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
      }
    };

    fetchNGOs();
  }, [token]);

  const handleVerify = async (id) => {
    try {
      const response = await axios.put(
        `/api/ngos/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNGOs((prev) =>
        prev.map((ngo) =>
          ngo._id === id ? { ...ngo, verified: response.data.verified } : ngo
        )
      );
    } catch (error) {
      console.error("Error verifying NGO:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">NGO Management</h1>
      <ul className="space-y-4">
        {ngos.map((ngo) => (
          <li
            key={ngo._id}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{ngo.name}</p>
              <p>{ngo.email}</p>
              <p>{ngo.phone}</p>
              <p>{ngo.address}</p>
              <p>
                Verified:{" "}
                <span
                  className={`font-bold ${
                    ngo.verified ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {ngo.verified ? "Yes" : "No"}
                </span>
              </p>
            </div>
            {!ngo.verified && (
              <button
                onClick={() => handleVerify(ngo._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Verify
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NGOManagement;
