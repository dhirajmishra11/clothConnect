import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";
import { Progress } from "../components/common/Progress";
import { FiBox, FiPackage, FiTruck } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function Collection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/ngos/collection");
      setCollections(response.data);
      setError(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch collections";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async (id, quantity) => {
    try {
      await axiosInstance.put(`/ngos/collection/${id}/distribute`, {
        quantity,
      });
      toast.success("Items marked as distributed");
      fetchCollections();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to distribute items";
      toast.error(errorMessage);
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
      title="Collection Inventory"
      subtitle="Manage and track collected donations"
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
        ) : collections.length === 0 ? (
          <Card>
            <div className="text-center p-6">
              <p className="text-gray-500">No collections found.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection._id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {collection.clothesType}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Added on{" "}
                            {new Date(
                              collection.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center">
                              <FiBox className="mr-2" />
                              Total Items
                            </span>
                            <span>{collection.quantity}</span>
                          </div>
                          <Progress
                            value={(collection.quantity / 1000) * 100}
                            color="blue"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center">
                              <FiTruck className="mr-2" />
                              Distributed
                            </span>
                            <span>{collection.distributed}</span>
                          </div>
                          <Progress
                            value={
                              (collection.distributed / collection.quantity) *
                              100
                            }
                            color="green"
                          />
                        </div>

                        <div className="pt-4">
                          <Button
                            variant="primary"
                            onClick={() => handleDistribute(collection._id, 10)}
                            disabled={
                              collection.quantity <= collection.distributed
                            }
                            className="w-full"
                          >
                            Mark 10 Items as Distributed
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Collection;
