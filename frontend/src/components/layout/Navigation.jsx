import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../common/Button';
import clsx from 'clsx';

const menuItems = {
  donor: [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'New Donation', path: '/new-donation', icon: '🎁' },
    { label: 'My Donations', path: '/my-donations', icon: '📦' },
    { label: 'Impact', path: '/impact', icon: '🌱' },
    { label: 'NGOs', path: '/ngos', icon: '🏢' },
    { label: 'Donations', path: '/donations', icon: '💰' }
  ],
  ngo: [
    { label: 'NGO Dashboard', path: '/ngo', icon: '📊' },
    { label: 'Donations', path: '/donations', icon: '📦' },
    { label: 'Collections', path: '/collections', icon: '🚚' },
    { label: 'Analytics', path: '/analytics', icon: '📈' }
  ],
  admin: [
    { label: 'Admin Panel', path: '/admin', icon: '⚙️' },
    { label: 'Users', path: '/users', icon: '👥' },
    { label: 'NGO Management', path: '/ngo-management', icon: '🏢' },
    { label: 'Reports', path: '/reports', icon: '📊' }
  ]
};

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about-us", label: "About Us" },
  { to: "/ngos", label: "NGOs" },
  { to: "/donations", label: "Donations" },
  { to: "/contact", label: "Contact" },
  { to: "/help", label: "Help" },
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const userRole = user?.role || 'donor';
  const navItems = menuItems[userRole];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.webp"
                alt="ClothConnect"
              />
              <span className="ml-2 text-xl font-bold text-primary-600">
                ClothConnect
              </span>
            </Link>
            
            {/* Desktop Navigation Items */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2',
                    isActive(item.path)
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="ml-3 relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center max-w-xs bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || 'https://via.placeholder.com/40'}
                  alt={user?.name}
                />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={clsx(
                    'h-6 w-6',
                    isMobileMenuOpen ? 'hidden' : 'block'
                  )}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={clsx(
                    'h-6 w-6',
                    isMobileMenuOpen ? 'block' : 'hidden'
                  )}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                    isActive(item.path)
                      ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};