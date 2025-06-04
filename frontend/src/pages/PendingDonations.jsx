import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { FiEye, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";
import { DonationCard } from "../components/cards/DonationCard";
import { FloatingWindow } from "../components/FloatingWindow";
import { StaggeredList } from "../components/animations/StaggeredList";

function PendingDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingDonations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/ngos/pending-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching pending donations:", error);
        setError(error.userMessage || "Failed to fetch pending donations");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDonations();
  }, [token]);

  const handleAccept = async (donation) => {
    try {
      await axiosInstance.put(
        `/donations/${donation._id}`,
        {
          status: "Accepted",
          ngoId: token.userId, // Add the NGO ID for authorization
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) =>
        prev.filter((d) => d._id !== donation._id)
      );
      setSelectedDonation(null);
    } catch (error) {
      console.error("Error accepting donation:", error);
      setError(error.userMessage || "Failed to accept donation");
    }
  };

  const handleReject = async (donation) => {
    try {
      await axiosInstance.put(
        `/donations/${donation._id}`,
        {
          status: "Rejected",
          ngoId: token.userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations((prev) =>
        prev.filter((d) => d._id !== donation._id)
      );
      setSelectedDonation(null);
    } catch (error) {
      console.error("Error rejecting donation:", error);
      setError(error.userMessage || "Failed to reject donation");
    }
  };

  return (
    <PageLayout
      title="Pending Donations"
      subtitle="Review and manage incoming donation requests"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg dark:bg-red-900/50 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        ) : donations.length === 0 ? (
          <Card>
            <div className="text-center p-6">
              <p className="text-gray-500 dark:text-gray-400">
                No pending donations to review
              </p>
            </div>
          </Card>
        ) : (
          <StaggeredList>
            {donations.map((donation) => (
              <DonationCard
                key={donation._id}
                donation={donation}
                type="ngo"
                onView={() => setSelectedDonation(donation)}
                onAccept={() => handleAccept(donation)}
                onReject={() => handleReject(donation)}
              />
            ))}
          </StaggeredList>
        )}
      </div>

      <FloatingWindow
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        title="Donation Details"
      >
        {selectedDonation && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDonation.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clothes Type</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDonation.clothesType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDonation.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedDonation.address}, {selectedDonation.city} - {selectedDonation.pincode}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDonation.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pickup Date</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedDonation.pickupDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {selectedDonation.message && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDonation.message}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedDonation(null)}
              >
                Close
              </Button>
              <Button
                variant="danger"
                onClick={() => handleReject(selectedDonation)}
              >
                <FiXCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="success"
                onClick={() => handleAccept(selectedDonation)}
              >
                <FiCheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </div>
          </div>
        )}
      </FloatingWindow>
    </PageLayout>
  );
}

export default PendingDonations;
