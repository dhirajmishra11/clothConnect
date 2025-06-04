import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Card } from './Card';

export const ProfileCard = ({
  user,
  stats,
  actions,
  className = '',
  loading = false
}) => {
  return (
    <Card 
      className={`overflow-hidden ${className}`}
      variant={user.role === 'ngo' ? 'ngo' : 'donor'}
      interactive={false}
    >
      <div className="relative">
        {/* Profile Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"
        />
        
        {/* Profile Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -bottom-12 left-4"
        >
          <div className="relative">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            {user.isVerified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-2 -bottom-2 bg-green-500 text-white p-1 rounded-full"
                title="Verified Account"
              >
                ✓
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Profile Content */}
      <div className="mt-14 px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
            {user.rating && (
              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                <span className="text-yellow-600 mr-1">⭐</span>
                <span className="text-sm font-medium text-yellow-800">
                  {user.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {user.bio && (
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
              {user.bio}
            </p>
          )}

          {/* Stats Grid */}
          {stats && (
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex space-x-3"
            >
              {actions.map((action, index) => (
                <Button
                  key={action.label}
                  variant={index === 0 ? user.role : 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className="flex-1"
                >
                  {action.label}
                </Button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center"
        >
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </Card>
  );
};