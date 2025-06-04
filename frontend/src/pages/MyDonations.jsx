import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "../components/layout/PageLayout";
import { DonationCard } from "../components/cards/DonationCard";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";
import { Progress } from "../components/common/Progress";
import { BadgeStatus } from "../components/common/BadgeStatus";
import { StaggeredList } from "../components/animations/StaggeredList";
import { useToast } from "../components/common/ToastContext";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const sortOptions = [
  { label: "Latest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
  { label: "Most Items", value: "items-desc" },
  { label: "Least Items", value: "items-asc" },
];

function MyDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/donations/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setError("Failed to fetch donations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDonations();
    }
  }, [token]);

  const filteredDonations = donations
    .filter((donation) => {
      if (activeFilter !== "all" && donation.status !== activeFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          donation.items.some((item) => item.name.toLowerCase().includes(query)) ||
          donation.location.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (activeSort) {
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "items-asc":
          return (
            a.items.reduce((sum, item) => sum + item.quantity, 0) -
            b.items.reduce((sum, item) => sum + item.quantity, 0)
          );
        case "items-desc":
          return (
            b.items.reduce((sum, item) => sum + item.quantity, 0) -
            a.items.reduce((sum, item) => sum + item.quantity, 0)
          );
        default:
          return 0;
      }
    });

  const handleCancelDonation = async (id) => {
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDonations((current) =>
        current.map((donation) =>
          donation.id === id ? { ...donation, status: "cancelled" } : donation
        )
      );

      toast.success("Donation cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel donation");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <PageLayout title="My Donations" subtitle="Track and manage your donations">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Donations",
              value: donations.length,
              icon: "🎁",
              color: "bg-blue-500",
            },
            {
              label: "Items Donated",
              value: donations.reduce(
                (sum, donation) =>
                  sum + donation.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
                0
              ),
              icon: "👕",
              color: "bg-green-500",
            },
            {
              label: "Completed",
              value: donations.filter((d) => d.status === "completed").length,
              icon: "✅",
              color: "bg-emerald-500",
            },
            {
              label: "Pending",
              value: donations.filter((d) => d.status === "pending").length,
              icon: "⏳",
              color: "bg-yellow-500",
            },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="ml-3">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Donations List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-24 bg-gray-200 rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {filteredDonations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900">No donations found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </motion.div>
            ) : (
              <StaggeredList className="space-y-4">
                {filteredDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                    onView={() => {
                      /* Handle view */
                    }}
                    onCancel={() => handleCancelDonation(donation.id)}
                  />
                ))}
              </StaggeredList>
            )}
          </AnimatePresence>
        )}
      </div>
    </PageLayout>
  );
}

export default MyDonations;
