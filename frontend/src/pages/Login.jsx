import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { login } from "../store/slices/authSlice";
import { FormLayout } from "../components/forms/FormLayout";
import { Input } from "../components/forms/Input";
import { PasswordInput } from "../components/forms/PasswordInput";
import { Button } from "../components/common/Button";
import axiosInstance from "../utils/axiosInstance";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(
        user.role === "donor"
          ? "/dashboard"
          : user.role === "ngo"
          ? "/ngo"
          : "/admin"
      );
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/users/login", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        twoFactorCode: formData.twoFactorCode,
      });

      const { data } = response;

      if (data.requires2FA) {
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      dispatch(login({ token: data.token, user: data.user }));
      navigate(
        data.user.role === "donor"
          ? "/dashboard"
          : data.user.role === "ngo"
          ? "/ngo"
          : "/admin"
      );
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 403:
            setError(
              err.response.data.message === "Please verify your email first"
                ? "Please verify your email first. Check your inbox for the verification link."
                : "Access denied. " + err.response.data.message
            );
            break;
          case 401:
            setError("Invalid email or password. Please check your credentials.");
            break;
          case 429:
            setError("Too many login attempts. Please try again later.");
            break;
          default:
            setError(err.response.data?.message || "Login failed. Please try again.");
        }
      } else {
        setError("Unable to connect to the server. Please check your internet connection.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-600 flex items-center justify-center bg-gradient-to-br from-white-900 to-white-800 px-4 py-12">
      <div className="w-full max-w-md">
        <FormLayout
          title={requires2FA ? "Two-Factor Authentication" : "Welcome Back"}
          subtitle={
            requires2FA
              ? "Enter the code from your authenticator app"
              : "Sign in to your account"
          }
          error={error}
          isLoading={loading}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {!requires2FA ? (
              <>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                />
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </>
            ) : (
              <Input
                label="2FA Code"
                name="twoFactorCode"
                value={formData.twoFactorCode}
                onChange={handleChange}
                required
                autoComplete="one-time-code"
                placeholder="Enter 6-digit code"
              />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : requires2FA ? "Verify" : "Sign in"}
            </Button>

            {!requires2FA && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </form>
        </FormLayout>
      </div>
    </div>
  );
}

export default Login;
