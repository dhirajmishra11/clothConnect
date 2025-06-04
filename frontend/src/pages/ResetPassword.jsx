import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { FormLayout } from "../components/forms/FormLayout";
import { PasswordInput } from "../components/forms/PasswordInput";
import { Button } from "../components/common/Button";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post(`/users/reset-password/${token}`, {
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  return (
    <FormLayout
      title="Create New Password"
      subtitle="Enter your new password"
      error={error}
      isLoading={loading}
    >
      {success ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-green-500 text-xl mb-4">
            Password Reset Successful!
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You will be redirected to the login page shortly.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordInput
            label="New Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter new password"
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm new password"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-yellow-500 hover:text-yellow-600"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </FormLayout>
  );
}

export default ResetPassword;