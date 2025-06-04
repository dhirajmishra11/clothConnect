import { motion } from 'framer-motion';
import { Card } from '../cards/Card';

const statVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 }
};

export const DashboardStats = ({ 
  stats = [], 
  loading = false,
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={statVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            variant={stat.variant || 'default'}
            className="h-full"
            interactive={false}
          >
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {typeof stat.value === 'number' ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={stat.value}
                    >
                      {stat.value}
                    </motion.span>
                  ) : stat.value}
                </div>
                {stat.icon && (
                  <div className={`p-2 rounded-full ${stat.iconBackground || 'bg-primary-100 text-primary-600'}`}>
                    {stat.icon}
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                {stat.change && (
                  <p className={`mt-2 flex items-center text-sm ${
                    stat.change > 0 
                      ? 'text-green-600 dark:text-green-500' 
                      : 'text-red-600 dark:text-red-500'
                  }`}>
                    {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                    <span className="ml-2">vs last month</span>
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};