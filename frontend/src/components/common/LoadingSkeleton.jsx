import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[180px] w-full" />
        );
      case 'stats':
        return (
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        );
      case 'text':
        return <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};