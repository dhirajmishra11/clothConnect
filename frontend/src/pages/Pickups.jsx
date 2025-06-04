import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiCheckCircle, FiX, FiXCircle } from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";

function Pickups() {
  const { token } = useSelector((state) => state.auth);
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axiosInstance.get("/ngos/pickups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPickups(response.data);
      } catch (error) {
        toast.error(
          "Failed to fetch pickups: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchPickups();
  }, [token]);

  const handlePicked = async (pickupId) => {
    setLoading(true);
    try {
      await axiosInstance.put(
        `/ngos/pickups/${pickupId}/complete`,
        { status: "Picked" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPickups((prev) => prev.filter((pickup) => pickup._id !== pickupId));
      toast.success("Pickup marked as completed!");
      setSelectedPickup(null);
    } catch (error) {
      toast.error(
        "Failed to mark pickup as completed: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (pickupId) => {
    setLoading(true);
    try {
      await axiosInstance.put(
        `/ngos/pickups/${pickupId}/reject`,
        { status: "Rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPickups((prev) => prev.filter((pickup) => pickup._id !== pickupId));
      toast.success("Pickup rejected successfully!");
      setSelectedPickup(null);
    } catch (error) {
      toast.error(
        "Failed to reject pickup: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Scheduled Pickups"
      subtitle="Manage and track scheduled donation pickups"
    >
      <div className="space-y-6">
        {pickups.length === 0 ? (
          <Card>
            <div className="text-center p-6">
              <p className="text-gray-500 dark:text-gray-400">
                No scheduled pickups found.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pickups.map((pickup) => (
              <Card
                key={pickup._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {pickup.title}
                  </h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p>Type: {pickup.clothesType}</p>
                    <p>Quantity: {pickup.quantity} items</p>
                    <p>Address: {pickup.address}</p>
                    <p>
                      Date: {new Date(pickup.pickupDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPickup(pickup)}
                      disabled={loading}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handlePicked(pickup._id)}
                      disabled={loading}
                    >
                      Mark as Picked
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedPickup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg m-4">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pickup Details
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPickup(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Clothes Type:</span>{" "}
                    {selectedPickup.clothesType}
                  </p>
                  <p>
                    <span className="font-medium">Quantity:</span>{" "}
                    {selectedPickup.quantity} items
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {selectedPickup.address}
                  </p>
                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {selectedPickup.city}
                  </p>
                  <p>
                    <span className="font-medium">Pincode:</span>{" "}
                    {selectedPickup.pincode}
                  </p>
                  <p>
                    <span className="font-medium">Contact:</span>{" "}
                    {selectedPickup.phone}
                  </p>
                  <p>
                    <span className="font-medium">Pickup Date:</span>{" "}
                    {new Date(selectedPickup.pickupDate).toLocaleString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="danger"
                    onClick={() => handleReject(selectedPickup._id)}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handlePicked(selectedPickup._id)}
                    disabled={loading}
                  >
                    Mark as Picked
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Pickups;
