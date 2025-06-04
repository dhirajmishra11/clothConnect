import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/cards/Card";
import { DonationCard } from "../components/cards/DonationCard";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { PageLayout } from "../components/layout/PageLayout";
import { StaggeredList } from "../components/animations/StaggeredList";
import { FloatingWindow } from "../components/FloatingWindow";
import { FiMapPin, FiPhone, FiCalendar, FiBox, FiTag, FiMessageSquare } from 'react-icons/fi';
import { logout } from "../store/slices/authSlice";

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-1">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const donationsRes = await axiosInstance.get("/donations/my-donations");
        const donations = donationsRes.data || [];
        setDonations(donations);

        // Calculate total items donated
        const totalItems = donations.reduce((sum, donation) => sum + (donation.quantity || 0), 0);
        
        // Calculate environmental impact (example: 2kg CO2 saved per item)
        const co2Saved = totalItems * 2;

        setStats([
          {
            label: "Total Donations",
            value: donations.length,
            change: donations.length > 0 ? Math.round((donations.length / 10) * 100) : 0,
            icon: "🎁",
            iconBackground: "bg-blue-100 text-blue-600",
            variant: "donor",
          },
          {
            label: "Items Donated",
            value: totalItems,
            change: totalItems > 0 ? Math.round((totalItems / 50) * 100) : 0,
            icon: "👕",
            iconBackground: "bg-green-100 text-green-600",
            variant: "success",
          },
          {
            label: "Impact Score",
            value: donations.length > 0 ? Math.min(5, donations.length / 2).toFixed(1) : "0.0",
            change: donations.length > 0 ? Math.round((donations.length / 10) * 100) : 0,
            icon: "⭐",
            iconBackground: "bg-yellow-100 text-yellow-600",
          },
          {
            label: "CO₂ Saved",
            value: co2Saved + "kg",
            change: co2Saved > 0 ? Math.round((co2Saved / 100) * 100) : 0,
            icon: "🌱",
            iconBackground: "bg-emerald-100 text-emerald-600",
            variant: "success",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.userMessage || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setIsDetailsOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <PageLayout
      title={`Welcome back, ${user?.name}`}
      subtitle="Here's an overview of your donation activity"
      actions={
        <div className="flex space-x-4">
          <Link to="/new-donation">
            <Button variant="primary" size="lg">
              New Donation
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <DashboardStats stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Donations */}
          <div className="lg:col-span-2">
            <Card>
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Donations
                </h3>
              </div>
              <div className="p-6">
                {error ? (
                  <p className="text-center text-red-600 dark:text-red-400">{error}</p>
                ) : donations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No donations yet</p>
                    <Link to="/new-donation">
                      <Button variant="outline">Make Your First Donation</Button>
                    </Link>
                  </div>
                ) : (
                  <StaggeredList className="space-y-4">
                    {donations.map((donation) => (
                      <DonationCard
                        key={donation._id}
                        donation={donation}
                        onView={() => handleViewDetails(donation)}
                      />
                    ))}
                  </StaggeredList>
                )}
              </div>
            </Card>
          </div>

          {/* Impact Summary */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Impact</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Environmental Impact
                    </span>
                    <span className="text-lg font-medium text-green-600 dark:text-green-400">
                      {stats[3]?.value || "0kg"} CO₂ saved
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 dark:bg-green-900 dark:text-green-300">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
                          {stats[3]?.change || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200 dark:bg-green-900">
                      <div
                        style={{ width: `${stats[3]?.change || 0}%` }}
                        className="transition-all duration-500 ease-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      />
                    </div>
                  </div>

                  <Link to="/impact" className="block">
                    <Button variant="outline" className="w-full">
                      View Full Impact Report
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FloatingWindow
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Donation Details"
      >
        {selectedDonation && (
          <div className="space-y-6">
            <DetailRow
              icon={FiTag}
              label="Title"
              value={selectedDonation.title}
            />
            <DetailRow
              icon={FiBox}
              label="Items"
              value={`${selectedDonation.quantity} ${selectedDonation.clothesType}`}
            />
            <DetailRow
              icon={FiMapPin}
              label="Location"
              value={`${selectedDonation.address}, ${selectedDonation.city} - ${selectedDonation.pincode}`}
            />
            <DetailRow
              icon={FiPhone}
              label="Contact"
              value={selectedDonation.phone}
            />
            <DetailRow
              icon={FiCalendar}
              label="Pickup Date"
              value={new Date(selectedDonation.pickupDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
            {selectedDonation.message && (
              <DetailRow
                icon={FiMessageSquare}
                label="Message"
                value={selectedDonation.message}
              />
            )}
          </div>
        )}
      </FloatingWindow>
    </PageLayout>
  );
}

export default Dashboard;
