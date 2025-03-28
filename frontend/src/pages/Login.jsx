import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import axios from "axios";
import logo from "../images/logo.webp";
import loginPanelImage from "../images/login-panel.webp";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "donor" ? "/dashboard" : user.role === "ngo" ? "/ngo" : "/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const { data } = await axios.post("/api/users/login", { email, password });
      dispatch(login(data));

      // Redirect based on user role
      navigate(data.user.role === "donor" ? "/dashboard" : data.user.role === "ngo" ? "/ngo" : "/admin");
    } catch (err) {
      setError("Invalid email or password"); // Generic error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col md:flex-row items-center bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Left Panel */}
        <div className="hidden md:block w-1/2">
          <img src={loginPanelImage} alt="Login Panel" className="w-full h-full object-cover" />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 rounded-full shadow-lg" />
          </div>
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Login to ClothConnect</h2>
            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4 text-center" role="alert">
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className={`w-full bg-yellow-500 text-gray-900 py-3 rounded hover:bg-yellow-400 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center mt-4 text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-yellow-400 hover:underline">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
