import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiPhone, FiCalendar, FiBox, FiTag, FiMessageSquare } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

const variants = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 }
  },
  content: {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20
    }
  }
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-1">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export const FloatingWindow = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  position = 'center'
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-20'
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants.overlay}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className={clsx(
            'fixed inset-0 overflow-y-auto z-50',
            'flex p-4',
            positionClasses[position]
          )}>
            <motion.div
              variants={variants.content}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={clsx(
                'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full',
                'p-6 overflow-hidden',
                sizeClasses[size]
              )}
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={onClose}
                  className="rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div>
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {title}
                  </h2>
                )}
                <div className="space-y-6">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
