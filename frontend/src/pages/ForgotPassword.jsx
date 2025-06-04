import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { FormLayout } from "../components/forms/FormLayout";
import { Input } from "../components/forms/Input";
import { Button } from "../components/common/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axiosInstance.post("/users/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link"
      error={error}
      isLoading={loading}
    >
      {success ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-green-500 text-xl mb-4">Email Sent!</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please check your email for instructions to reset your password.
          </p>
          <Link
            to="/login"
            className="text-yellow-500 hover:text-yellow-600"
          >
            Return to Login
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;