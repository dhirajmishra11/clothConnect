import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";

function Donated() {
  const { token } = useSelector((state) => state.auth);
  const [clothesType, setClothesType] = useState("children"); // Default value
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!clothesType || clothesType.trim() === "") {
      setError("Please select a valid clothes type.");
      return;
    }

    try {
      await axiosInstance.post(
        "/ngos/donated",
        { clothesType, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Clothes marked as donated successfully!");
      setClothesType("children"); // Reset to default value
      setQuantity("");
    } catch (error) {
      setError("Error marking clothes as donated. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">
        Mark as Donated
      </h1>
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        {/* Clothes Type */}
        <div>
          <label className="block mb-2 font-bold text-yellow-500">
            Clothes Type
          </label>
          <select
            value={clothesType}
            onChange={(e) => setClothesType(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-600 bg-gray-700 text-white"
          >
            <option value="children">Children</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-2 font-bold text-yellow-500">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-600 bg-gray-700 text-white"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Donated;
