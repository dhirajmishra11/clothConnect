import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../cards/Card';
import { FaArrowLeft } from 'react-icons/fa';

export const FormLayout = ({
  children,
  title,
  subtitle,
  error,
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Back Button */}
      <Link
        to="/landing"
        className="absolute top-4 left-4 flex items-center text-gray-900 dark:text-gray-100 hover:text-yellow-500 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Home
      </Link>

      <Card
        className="max-w-md w-full space-y-8"
        interactive={false}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Form Header */}
          <div className="text-center">
            {title && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-sm text-gray-900 dark:text-gray-100"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 rounded-md bg-red-50 border border-red-200"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-lg flex items-center justify-center"
              >
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-6 relative"
          >
            {children}
          </motion.div>
        </motion.div>
      </Card>
    </div>
  );
};