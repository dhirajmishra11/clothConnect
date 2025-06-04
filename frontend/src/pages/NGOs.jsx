import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiCheckCircle } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { PageLayout } from "../components/layout/PageLayout";
import { Card } from "../components/cards/Card";
import { Button } from "../components/common/Button";

function NGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNGO, setSelectedNGO] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await axiosInstance.get("/ngos");
        setNgos(response.data.filter((ngo) => ngo.verified));
      } catch (err) {
        setError("Failed to load NGOs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  return (
    <PageLayout
      title="Partner NGOs"
      subtitle="Discover our network of verified NGO partners"
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-64">
              <div className="h-full bg-gray-200 dark:bg-gray-700 rounded" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo) => (
            <motion.div
              key={ngo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {ngo.name}
                    </h3>
                    <FiCheckCircle className="text-green-500" size={20} />
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiMapPin className="mr-2" />
                      <span>{ngo.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiPhone className="mr-2" />
                      <span>{ngo.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiMail className="mr-2" />
                      <span>{ngo.email}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => setSelectedNGO(ngo)}
                    >
                      Contact NGO
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedNGO && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedNGO(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Contact {selectedNGO.name}
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  You can reach out to {selectedNGO.name} through:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiPhone className="text-yellow-500 mr-2" />
                    <a
                      href={`tel:${selectedNGO.phone}`}
                      className="text-gray-900 dark:text-gray-100 hover:text-yellow-500"
                    >
                      {selectedNGO.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="text-yellow-500 mr-2" />
                    <a
                      href={`mailto:${selectedNGO.email}`}
                      className="text-gray-900 dark:text-gray-100 hover:text-yellow-500"
                    >
                      {selectedNGO.email}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedNGO(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

export default NGOs;
