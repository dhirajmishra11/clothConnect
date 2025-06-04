import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/cards/Card';
import { DonationChart } from '../components/dashboard/DonationChart';
import { Progress } from '../components/common/Progress';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/analytics');
      setAnalytics(response.data);
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch analytics data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
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
      title="Analytics Dashboard"
      subtitle="Comprehensive platform statistics and insights"
    >
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <Card>
            <div className="text-center p-6 text-red-600">{error}</div>
          </Card>
        ) : analytics && (
          <>
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">User Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Users</span>
                      <span>{analytics.userStats.total}</span>
                    </div>
                    <Progress value={(analytics.userStats.total / 1000) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Donors</span>
                      <span>{analytics.userStats.donors}</span>
                    </div>
                    <Progress
                      value={(analytics.userStats.donors / analytics.userStats.total) * 100}
                      color="blue"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Verified NGOs</span>
                      <span>{analytics.userStats.verifiedNGOs}</span>
                    </div>
                    <Progress
                      value={(analytics.userStats.verifiedNGOs / analytics.userStats.total) * 100}
                      color="green"
                    />
                  </div>
                </div>
              </Card>

              {/* Donation Statistics */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Donation Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Donations</span>
                      <span>{analytics.donationStats.total}</span>
                    </div>
                    <Progress value={(analytics.donationStats.total / 1000) * 100} color="yellow" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pending</span>
                      <span>{analytics.donationStats.pending}</span>
                    </div>
                    <Progress
                      value={(analytics.donationStats.pending / analytics.donationStats.total) * 100}
                      color="orange"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completed</span>
                      <span>{analytics.donationStats.completed}</span>
                    </div>
                    <Progress
                      value={(analytics.donationStats.completed / analytics.donationStats.total) * 100}
                      color="green"
                    />
                  </div>
                </div>
              </Card>

              {/* Collection Statistics */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Collection Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Items</span>
                      <span>{analytics.collectionStats.total}</span>
                    </div>
                    <Progress value={(analytics.collectionStats.total / 10000) * 100} color="purple" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Distributed</span>
                      <span>{analytics.collectionStats.distributed}</span>
                    </div>
                    <Progress
                      value={(analytics.collectionStats.distributed / analytics.collectionStats.total) * 100}
                      color="blue"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>In Stock</span>
                      <span>{analytics.collectionStats.inStock}</span>
                    </div>
                    <Progress
                      value={(analytics.collectionStats.inStock / analytics.collectionStats.total) * 100}
                      color="green"
                    />
                  </div>
                </div>
              </Card>

              {/* Monthly Trends */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Monthly Trends</h3>
                <DonationChart
                  data={analytics.monthlyStats}
                  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                />
              </Card>
            </div>

            {/* Clothes Type Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Clothes Type Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(analytics.clothesTypeDistribution).map(([type, count]) => (
                  <div
                    key={type}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-2xl mb-2 text-center">
                      {type === 'Mens' ? '👔' : type === 'Womens' ? '👗' : '👕'}
                    </div>
                    <div className="text-sm font-medium text-center">{type}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                      {count} items
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default Analytics;