import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Progress } from "../components/common/Progress";
import { FiPackage, FiUsers, FiCalendar } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function Donated() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalDistributed: 0,
    totalBeneficiaries: 0,
    impactScore: 0,
  });

  useEffect(() => {
    fetchDonatedItems();
  }, []);

  const fetchDonatedItems = async () => {
    try {
      setLoading(true);
      const [collectionsRes, analyticsRes] = await Promise.all([
        axiosInstance.get("/ngos/collection"),
        axiosInstance.get("/ngos/analytics"),
      ]);

      const collections = collectionsRes.data;
      const analytics = analyticsRes.data;

      setDonations(collections.filter((c) => c.distributed > 0));

      // Calculate stats
      const totalDistributed = collections.reduce(
        (sum, c) => sum + (c.distributed || 0),
        0
      );
      const totalBeneficiaries = Math.floor(totalDistributed / 3); // Assume 3 items per beneficiary
      const impactScore = totalDistributed * 2; // 2 points per item distributed

      setStats({
        totalDistributed,
        totalBeneficiaries,
        impactScore,
      });

      setError(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch donated items";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "ngo") {
    return (
      <PageLayout>
        <div className="text-center text-red-600">
          Unauthorized access. This page is only for NGO users.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Donated Items"
      subtitle="Track distributed donations and their impact"
    >
      <div className="space-y-8">
        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiPackage className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Distributed
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDistributed}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Beneficiaries Reached
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBeneficiaries}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiCalendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Impact Score
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.impactScore}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Donated Items List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <Card>
              <div className="text-center p-6 text-red-600">{error}</div>
            </Card>
          ) : donations.length === 0 ? (
            <Card>
              <div className="text-center p-6">
                <p className="text-gray-500">
                  No donations have been distributed yet.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <Card key={donation._id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {donation.clothesType}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(donation.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Total Collected</span>
                            <span>{donation.quantity}</span>
                          </div>
                          <Progress
                            value={(donation.quantity / 1000) * 100}
                            color="blue"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Distributed</span>
                            <span>{donation.distributed}</span>
                          </div>
                          <Progress
                            value={
                              (donation.distributed / donation.quantity) * 100
                            }
                            color="green"
                          />
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          {Math.floor(donation.distributed / 3)} beneficiaries
                          reached
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default Donated;
