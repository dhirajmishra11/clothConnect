import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  default: 'border-gray-200 hover:border-gray-300',
  donor: 'border-blue-200 hover:border-blue-300',
  ngo: 'border-green-200 hover:border-green-300',
  admin: 'border-gray-300 hover:border-gray-400',
  success: 'border-green-200 hover:border-green-300',
  warning: 'border-yellow-200 hover:border-yellow-300',
  error: 'border-red-200 hover:border-red-300',
};

export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  interactive = true,
  onClick,
  ...props 
}) => {
  const Component = interactive ? motion.div : 'div';
  
  return (
    <Component
      whileHover={interactive ? { y: -2 } : undefined}
      className={clsx(
        'relative bg-white dark:bg-gray-800',
        'rounded-lg border p-4 shadow-sm',
        'transition-colors duration-200',
        variants[variant],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};