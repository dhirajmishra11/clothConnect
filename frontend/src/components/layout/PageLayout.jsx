import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ThemeToggle } from '../common/ThemeToggle';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const PageLayout = ({ 
  children, 
  className = '',
  title,
  subtitle,
  actions,
  fullWidth = false,
  animate = true
}) => {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      variants={animate ? pageVariants : undefined}
      initial="initial"
      animate="animate"
      exit="exit"
      className={clsx(
        'min-h-screen bg-gray-50 dark:bg-gray-900',
        'py-8 px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      <div className={clsx(
        'mx-auto',
        !fullWidth && 'max-w-7xl'
      )}>
        {(title || actions || subtitle) && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {actions && (
                  <div className="flex items-center space-x-4">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <main className="text-gray-900 dark:text-white">
          {children}
        </main>
      </div>
    </Component>
  );
};