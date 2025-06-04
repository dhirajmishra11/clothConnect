import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";
import axiosInstance from "../utils/axiosInstance";

function NewDonation() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: "",
    clothesType: "children",
    quantity: 1,
    address: "",
    city: "",
    pincode: "",
    phone: "",
    pickupDate: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateInputs = () => {
    let tempErrors = {};
    if (!/^[0-9]{6}$/.test(formData.pincode))
      tempErrors.pincode = "Pincode must be a 6-digit number.";
    if (!/^[0-9]{10}$/.test(formData.phone))
      tempErrors.phone = "Phone number must be a 10-digit number.";
    if (!formData.title.trim()) tempErrors.title = "Title is required.";
    if (!formData.address.trim()) tempErrors.address = "Address is required.";
    if (!formData.city.trim()) tempErrors.city = "City is required.";
    if (new Date(formData.pickupDate) < new Date())
      tempErrors.pickupDate = "Pickup date must be in the future.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    setSuccess(false);

    try {
      await axiosInstance.post("/donations", formData);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setErrors({
        api: err.userMessage || "Failed to create donation.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      clothesType: "children",
      quantity: 1,
      address: "",
      city: "",
      pincode: "",
      phone: "",
      pickupDate: "",
      message: "",
    });
    setErrors({});
    setSuccess(false);
  };

  return (
    <PageLayout
      title="Create New Donation"
      subtitle="Fill in the details for your clothing donation"
    >
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden">
          <div className="p-6">
            {errors.api && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200">
                {errors.api}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-200">
                Donation created successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Donation Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., Winter Clothes for Kids"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Clothes Type
                  </label>
                  <select
                    name="clothesType"
                    value={formData.clothesType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="children">Children</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.pickupDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.pickupDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Any special instructions for pickup?"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? "Creating Donation..." : "Submit Donation"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

export default NewDonation;
