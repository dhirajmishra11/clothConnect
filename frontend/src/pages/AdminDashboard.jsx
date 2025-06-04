import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiTrendingUp, FiBarChart2 } from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { DonationChart } from "../components/dashboard/DonationChart";
import { Button } from "../components/common/Button";
import Loader from "../components/Loader";
import axiosInstance from "../utils/axiosInstance";
import { logout } from "../store/slices/authSlice";

function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const analyticsRes = await axiosInstance.get("/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const { totalDonations, totalItems, ngoCount, donorCount, monthlyStats } = analyticsRes.data;

        setStats([
          {
            label: "Total Collections",
            value: totalItems,
            change: totalItems > 0 ? Math.round((totalItems / 1000) * 100) : 0,
            icon: "📦",
            iconBackground: "bg-purple-100 text-purple-600",
            variant: "admin",
          },
          {
            label: "Active Donors",
            value: donorCount,
            change: donorCount > 0 ? Math.round((donorCount / 100) * 100) : 0,
            icon: "👥",
            iconBackground: "bg-blue-100 text-blue-600",
          },
          {
            label: "Verified NGOs",
            value: ngoCount,
            change: ngoCount > 0 ? Math.round((ngoCount / 20) * 100) : 0,
            icon: "🏢",
            iconBackground: "bg-green-100 text-green-600",
          },
          {
            label: "Success Rate",
            value: totalDonations > 0 ? Math.round((totalItems / totalDonations) * 100) + "%" : "0%",
            change: totalDonations > 0 ? Math.round((totalItems / totalDonations) * 100) : 0,
            icon: "⭐",
            iconBackground: "bg-yellow-100 text-yellow-600",
            variant: "success",
          },
        ]);

        setMonthlyData(monthlyStats.map((value, index) => ({
          label: new Date(2024, index).toLocaleString('default', { month: 'short' }),
          value: value || 0,
          id: index + 1,
        })));
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError(error.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader /></div>;
  }

  return (
    <PageLayout 
      title="Admin Dashboard" 
      subtitle="Monitor and manage overall platform activity"
      actions={
        <Button variant="outline" size="lg" onClick={handleLogout}>
          Logout
        </Button>
      }
    >
      <div className="space-y-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        
        <DashboardStats stats={stats} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DonationChart 
            title="Monthly Collections"
            subtitle="Number of items collected per month"
            data={monthlyData}
            loading={loading}
          />

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Distribution Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Total Collected
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {stats[0]?.value || 0} items
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Distributed
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {Math.floor(stats[0]?.value * 0.75) || 0} items
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/donors")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiUsers className="text-blue-600 dark:text-blue-400 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Manage Donors
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View and manage donor accounts
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/ngos")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiTrendingUp className="text-green-600 dark:text-green-400 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  NGO Management
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Verify and manage NGO partners
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/analytics")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiBarChart2 className="text-purple-600 dark:text-purple-400 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Analytics
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View detailed platform analytics
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default AdminDashboard;
