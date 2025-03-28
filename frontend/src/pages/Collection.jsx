import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function Collection() {
  const { token } = useSelector((state) => state.auth);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get("/api/collections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    fetchCollection();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-yellow-500 text-center">Collection</h1>
      {collection.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No collection data found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex justify-between items-center hover:shadow-xl transition-shadow"
            >
              <span className="text-lg font-semibold">{item.clothesType}</span>
              <span className="text-xl font-bold text-green-400">{item.quantity} items</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;
