import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import {
  FiPackage,
  FiUsers,
  FiTruck,
  FiInbox,
  FiCheckCircle,
} from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { Button } from "../components/common/Button";
import { DonationChart } from "../components/dashboard/DonationChart";
import Loader from "../components/Loader";

function NGOPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [distributionData, setDistributionData] = useState({
    collected: 0,
    distributed: 0,
    inProcess: 0,
  });

  useEffect(() => {
    const fetchNGOData = async () => {
      setLoading(true);
      try {
        const [collectionsRes, donationsRes, distributionRes] = await Promise.all([
          axiosInstance.get("/collections", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/donations/ngo", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/collections/distribution", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const totalCollected = collectionsRes.data.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );

        const pendingDonations = donationsRes.data.filter(
          (d) => d.status === "pending"
        ).length;

        setStats([
          {
            label: "Total Collections",
            value: totalCollected,
            change: 12,
            icon: "📦",
            iconBackground: "bg-purple-100 text-purple-600",
            variant: "ngo",
          },
          {
            label: "Pending Donations",
            value: pendingDonations,
            change: 8,
            icon: "⏳",
            iconBackground: "bg-yellow-100 text-yellow-600",
          },
          {
            label: "Active Donors",
            value: donationsRes.data.length,
            change: 15,
            icon: "👥",
            iconBackground: "bg-blue-100 text-blue-600",
          },
          {
            label: "Success Rate",
            value: "92%",
            change: 23,
            icon: "⭐",
            iconBackground: "bg-green-100 text-green-600",
            variant: "success",
          },
        ]);

        // Process monthly data
        const monthlyStats = new Array(6).fill(0);
        collectionsRes.data.forEach((collection) => {
          const month = new Date(collection.createdAt).getMonth();
          if (month >= 0 && month < 6) {
            monthlyStats[month] += collection.quantity || 0;
          }
        });

        setMonthlyData([
          { label: "Jan", value: monthlyStats[0] },
          { label: "Feb", value: monthlyStats[1] },
          { label: "Mar", value: monthlyStats[2] },
          { label: "Apr", value: monthlyStats[3] },
          { label: "May", value: monthlyStats[4] },
          { label: "Jun", value: monthlyStats[5] },
        ]);

        // Set distribution data
        const { collected, distributed, inProcess } = distributionRes.data;
        setDistributionData({
          collected: collected || totalCollected,
          distributed: distributed || Math.floor(totalCollected * 0.75),
          inProcess: inProcess || Math.floor(totalCollected * 0.25),
        });
      } catch (error) {
        console.error("Error fetching NGO data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOData();
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <PageLayout
      title={`Welcome, ${user?.name}`}
      subtitle="Manage your NGO operations and track impact"
      actions={
        <Button variant="outline" size="lg" onClick={handleLogout}>
          Logout
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <DashboardStats stats={stats} loading={loading} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/ngo/pending-donations")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiPackage className="text-yellow-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Pending Donations
                </h3>
                <p className="text-sm text-gray-500">
                  Review and process new donations
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/ngo/pickups")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiTruck className="text-blue-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Pickups
                </h3>
                <p className="text-sm text-gray-500">
                  Schedule and manage pickups
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/ngo/collection")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiInbox className="text-green-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Collection
                </h3>
                <p className="text-sm text-gray-500">
                  View collection inventory
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/ngo/donated")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiCheckCircle className="text-purple-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Donated
                </h3>
                <p className="text-sm text-gray-500">
                  Track completed donations
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DonationChart
            title="Monthly Collections"
            subtitle="Number of items collected per month"
            data={monthlyData}
            loading={loading}
          />

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Distribution Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Collected</span>
                  <span className="font-medium text-gray-900">
                    {distributionData.collected} items
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Distributed</span>
                  <span className="font-medium text-gray-900">
                    {distributionData.distributed} items
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (distributionData.distributed /
                          distributionData.collected) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">In Process</span>
                  <span className="font-medium text-gray-900">
                    {distributionData.inProcess} items
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (distributionData.inProcess /
                          distributionData.collected) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default NGOPanel;
