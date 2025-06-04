import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";
import { FiCheck, FiX, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { StaggeredList } from "../components/animations/StaggeredList";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function NGOManagement() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/ngos");
      setNgos(response.data);
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch NGOs";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (ngoId) => {
    try {
      const response = await axiosInstance.put(`/admin/ngos/${ngoId}/verify`);
      setNgos((prev) =>
        prev.map((ngo) =>
          ngo._id === ngoId ? { ...ngo, verified: true } : ngo
        )
      );
      toast.success("NGO verified successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to verify NGO";
      toast.error(errorMessage);
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
      title="NGO Management"
      subtitle="View and manage NGO partner applications"
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
        ) : ngos.length === 0 ? (
          <Card>
            <div className="text-center p-6">
              <p className="text-gray-500">No NGO applications found.</p>
            </div>
          </Card>
        ) : (
          <StaggeredList>
            {ngos.map((ngo) => (
              <Card key={ngo._id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        {ngo.name}
                        {ngo.verified && (
                          <span className="ml-2 text-green-500">✓</span>
                        )}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <p className="flex items-center">
                          <FiMail className="mr-2" />
                          {ngo.email}
                        </p>
                        <p className="flex items-center">
                          <FiPhone className="mr-2" />
                          {ngo.phone}
                        </p>
                        <p className="flex items-center">
                          <FiMapPin className="mr-2" />
                          {ngo.address}
                        </p>
                      </div>

                      {ngo.ngoRegistration && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Registration: {ngo.ngoRegistration}
                          </p>
                        </div>
                      )}
                    </div>

                    {!ngo.verified && (
                      <div className="flex space-x-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleVerify(ngo._id)}
                          className="flex items-center"
                        >
                          <FiCheck className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      </div>
                    )}
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

export default NGOManagement;
