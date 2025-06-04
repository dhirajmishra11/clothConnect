import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { PageLayout } from "../components/layout/PageLayout";
import { Input } from "../components/forms/Input";
import { Button } from "../components/common/Button";
import { ProfileCard } from "../components/cards/ProfileCard";
import { Card } from "../components/cards/Card";

export const ProfileEdit = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    organization: user?.organization || "",
    registrationNumber: user?.registrationNumber || "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axiosInstance.put(
        `/users/${user.id}`,
        { ...formData, password: password || undefined }, // Only send password if provided
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const previewStats = [
    { label: "Donations", value: user?.donations?.length || 0 },
    { label: "Impact", value: "123kg" },
    { label: "Rating", value: user?.rating || "4.5" },
  ];

  return (
    <PageLayout title="Edit Profile" subtitle="Update your profile information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <ProfileCard
              user={{
                ...user,
                avatar: profileImage || user?.avatar,
                name: formData.name || user?.name,
                bio: formData.bio || user?.bio,
              }}
              stats={previewStats}
              className="sticky top-6"
            />

            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Profile Picture</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg
                          className="h-12 w-12"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="mt-4 flex text-sm text-gray-600 justify-center">
                        <span>Upload a photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </motion.label>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 p-4 rounded-md"
                >
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Input
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {user?.role === "ngo" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="Organization Name"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Registration Number"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfileEdit;
