import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const icons = {
  success: <FiCheck className="text-green-500" size={20} />,
  error: <FiX className="text-red-500" size={20} />,
  info: <FiInfo className="text-blue-500" size={20} />,
  warning: <FiAlertTriangle className="text-yellow-500" size={20} />
};

export const NotificationBar = ({
  type = 'info',
  message,
  isVisible,
  onClose,
  duration = 3000
}) => {
  React.useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
            {icons[type]}
            <span className="text-gray-900 dark:text-gray-100">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};