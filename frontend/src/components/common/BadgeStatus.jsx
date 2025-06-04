import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: '⏳'
  },
  processing: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    icon: '⚡'
  },
  completed: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    icon: '✓'
  },
  cancelled: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-200',
    icon: '✕'
  },
  verified: {
    bg: 'bg-emerald-100 dark:bg-emerald-900',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: '✓'
  },
  unverified: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    icon: '?'
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

export const BadgeStatus = ({
  status,
  showIcon = true,
  pulse = false,
  tooltip,
  className = ''
}) => {
  const variant = variants[status.toLowerCase()] || variants.pending;
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <div className="relative group">
      <motion.div
        animate={pulse ? pulseAnimation : undefined}
        className={clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variant.bg,
          variant.text,
          className
        )}
      >
        {showIcon && (
          <span className="mr-1">{variant.icon}</span>
        )}
        {formattedStatus}
      </motion.div>
      
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0, y: -4 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </motion.div>
      )}
    </div>
  );
};