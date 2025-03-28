import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

function ProfileEdit() {
  const { user, token } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/users/${user.id}`,
        { name, email, password: password || undefined }, // Only send password if provided
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setError("");
      console.log("Profile updated successfully:", response.data);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-yellow-400 mb-6">
          Edit Profile
        </h2>

        {success && (
          <div className="bg-green-500 text-white p-3 rounded-md text-center mb-4">
            ✅ Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-center mb-4">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              Password{" "}
              <span className="text-gray-400 text-xs">
                (Leave blank to keep current password)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-md hover:bg-yellow-600 transition-all duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
