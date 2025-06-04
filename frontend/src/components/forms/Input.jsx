import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  wrapperClassName = '',
  animate = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const Component = animate ? motion.input : 'input';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={clsx('space-y-1', wrapperClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}
      <div className="relative">
        <Component
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={clsx(
            'block w-full rounded-md shadow-sm',
            'transition duration-200 ease-in-out',
            'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500',
            className
          )}
          whileFocus={animate ? { scale: 1.01 } : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};