import React from 'react';
import clsx from 'clsx';

const colors = {
  default: 'bg-primary-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500'
};

export const Progress = ({ value = 0, color = 'default', className = '' }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={clsx('w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700', className)}>
      <div
        className={clsx(
          'h-2 rounded-full transition-all duration-300',
          colors[color] || colors.default
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};