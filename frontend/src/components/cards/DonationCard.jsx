import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { Card } from './Card';
import Loader from '../Loader';

const statusColors = {
  Pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: '⏳'
  },
  Accepted: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    icon: '✅'
  },
  Completed: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    icon: '🎉'
  },
  Rejected: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-200',
    icon: '❌'
  },
  Scheduled: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-800 dark:text-purple-200',
    icon: '📅'
  }
};

export const DonationCard = ({
  donation,
  onAccept,
  onReject,
  onView,
  isLoading = false,
  type = 'donor'
}) => {
  const { status, clothesType, quantity, city, pickupDate, title, message } = donation;
  const statusConfig = statusColors[status] || statusColors.Pending;
  
  return (
    <Card 
      variant={type}
      className="animate-fade-in overflow-hidden"
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-10 flex items-center justify-center"
          >
            <Loader size="lg" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
          >
            {statusConfig.icon} <span className="ml-1">{status}</span>
          </motion.span>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(pickupDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <span className="mr-1">📍</span> {city}
            </p>
            <div className="mt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {quantity} {clothesType}
              </span>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex flex-col space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(donation)}
              className="whitespace-nowrap"
            >
              View Details
            </Button>
          )}
          {status === 'Pending' && type === 'ngo' && (
            <>
              <Button
                variant="ngo"
                size="sm"
                onClick={() => onAccept(donation)}
                className="whitespace-nowrap"
              >
                Accept
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReject(donation)}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400"
              >
                Decline
              </Button>
            </>
          )}
        </motion.div>
      </div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm text-gray-600 dark:text-gray-300"
        >
          {message}
        </motion.p>
      )}
    </Card>
  );
};