import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  success: {
    icon: '✓',
    bg: 'bg-green-50 dark:bg-green-900',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    progress: 'bg-green-500'
  },
  error: {
    icon: '✕',
    bg: 'bg-red-50 dark:bg-red-900',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    progress: 'bg-red-500'
  },
  info: {
    icon: 'ℹ',
    bg: 'bg-blue-50 dark:bg-blue-900',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    progress: 'bg-blue-500'
  },
  warning: {
    icon: '⚠',
    bg: 'bg-yellow-50 dark:bg-yellow-900',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    progress: 'bg-yellow-500'
  }
};

export const Toast = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  position = 'bottom-right',
  showProgress = true
}) => {
  const variant = variants[type];

  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className={clsx(
          'fixed z-50 flex items-start max-w-sm w-full rounded-lg shadow-lg border',
          variant.bg,
          variant.border,
          positionClasses[position]
        )}
      >
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className={clsx('flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-sm', variant.text)}>
              {variant.icon}
            </div>
            <div className="ml-3 flex-1">
              <p className={clsx('text-sm font-medium', variant.text)}>
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={clsx(
                  'inline-flex text-gray-400 hover:text-gray-500 focus:outline-none',
                  'rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {showProgress && duration !== Infinity && (
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={clsx('absolute bottom-0 left-0 h-1', variant.progress)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};