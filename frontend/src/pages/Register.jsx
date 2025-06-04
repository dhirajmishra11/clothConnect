import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { FormLayout } from "../components/forms/FormLayout";
import { Input } from "../components/forms/Input";
import { PasswordInput } from "../components/forms/PasswordInput";
import { Button } from "../components/common/Button";

const steps = [
  {
    id: "userType",
    title: "Choose Account Type",
    subtitle: "Select the type of account you want to create",
  },
  {
    id: "basicInfo",
    title: "Basic Information",
    subtitle: "Tell us about yourself",
  },
  {
    id: "details",
    title: "Additional Details",
    subtitle: "Complete your profile",
  },
];

const accountTypes = [
  {
    id: "donor",
    label: "Donor",
    icon: "🎁",
    description: "I want to donate clothes",
  },
  {
    id: "ngo",
    label: "NGO",
    icon: "🏢",
    description: "I represent an NGO",
  },
];

function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("userType");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    ngoRegistration: "",
  });

  const handleAccountTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, userType: type }));
    setCurrentStep("basicInfo");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate password length
      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.userType, // This matches our backend expectation
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        ...(formData.userType === "ngo" && {
          ngoRegistration: formData.ngoRegistration.trim(),
        }),
      };

      const response = await axiosInstance.post("/users/register", registrationData);

      if (response.data) {
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || "Please check your information and try again");
            break;
          case 409:
            setError("This email is already registered. Please try logging in or use a different email address");
            break;
          case 429:
            setError("Too many registration attempts. Please wait a few minutes before trying again");
            break;
          default:
            setError(err.response.data.message || "Registration failed. Please try again later");
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Unable to connect to the server. Please check your internet connection");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("basicInfo");
    } else if (currentStep === "basicInfo") {
      setCurrentStep("userType");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "userType":
        return (
          <div className="grid grid-cols-1 gap-4">
            {accountTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => handleAccountTypeSelect(type.id)}
                className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-500 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case "basicInfo":
        return (
          <form className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep("details")}>Next</Button>
            </div>
          </form>
        );

      case "details":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            {formData.userType === "ngo" && (
              <Input
                label="NGO Registration Number"
                name="ngoRegistration"
                value={formData.ngoRegistration}
                onChange={handleChange}
                required
              />
            )}
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <FormLayout
      title={currentStepData.title}
      subtitle={currentStepData.subtitle}
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
            Registration successful!
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please check your email to verify your account. You will be redirected
            to the login page shortly.
          </p>
        </motion.div>
      ) : (
        renderStep()
      )}
      {currentStep === "userType" && !success && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-yellow-500 hover:text-yellow-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}
    </FormLayout>
  );
}

export default Register;
