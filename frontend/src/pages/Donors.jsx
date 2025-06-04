import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";
import { Progress } from "../components/common/Progress";
import { StaggeredList } from "../components/animations/StaggeredList";
import { FiMail, FiPhone, FiPackage, FiCalendar } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function Donors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/donors");
      setDonors(response.data);
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch donors";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <PageLayout>
        <div className="text-center text-red-600">
          Unauthorized access. This page is only for admin users.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Donor Management"
      subtitle="View and manage donor profiles"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <Card>
            <div className="text-center p-6 text-red-600">{error}</div>
          </Card>
        ) : donors.length === 0 ? (
          <Card>
            <div className="text-center p-6">
              <p className="text-gray-500">No donors found.</p>
            </div>
          </Card>
        ) : (
          <StaggeredList>
            {donors.map((donor) => (
              <Card key={donor._id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <img
                          src={donor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.name)}&background=random`}
                          alt={donor.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {donor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Joined {new Date(donor.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <p className="flex items-center">
                          <FiMail className="mr-2" />
                          {donor.email}
                        </p>
                        {donor.phone && (
                          <p className="flex items-center">
                            <FiPhone className="mr-2" />
                            {donor.phone}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center">
                              <FiPackage className="mr-2" />
                              Total Donations
                            </span>
                            <span>{donor.totalDonations || 0}</span>
                          </div>
                          <Progress
                            value={(donor.totalDonations || 0) / 10 * 100}
                            color="blue"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center">
                              <FiCalendar className="mr-2" />
                              Last Active
                            </span>
                            <span>
                              {donor.lastActive
                                ? new Date(donor.lastActive).toLocaleDateString()
                                : "Never"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </StaggeredList>
        )}
      </div>
    </PageLayout>
  );
}

export default Donors;
