import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/logo.webp"; // Logo image
import loginPanelImage from "../images/login-panel.webp"; // Background image

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor"); // Role state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/users/register", { name, email, password, role }); // Include role in registration
      navigate("/login"); // Redirect on success
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col md:flex-row items-center bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        
        {/* Left Panel - Image */}
        <div className="hidden md:block w-1/2">
          <img
            src={loginPanelImage}
            alt="Register Panel"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
          </div>

          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
            Create an Account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              aria-label="Full Name"
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              aria-label="Email"
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              disabled={loading}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              disabled={loading}
            >
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className={`w-full bg-yellow-500 text-gray-900 py-3 rounded hover:bg-yellow-400 transition  ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center mt-4 text-gray-400">
              Already have an account?{" "}
              <span
                className="text-yellow-400 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
