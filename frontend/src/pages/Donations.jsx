import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Input } from '../components/forms/Input';
import { Card } from '../components/cards/Card';
import { Progress } from '../components/common/Progress';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import axiosInstance from '../utils/axiosInstance';
import { FiPackage, FiUsers, FiTrendingUp, FiFilter } from 'react-icons/fi';
import { FloatingWindow } from '../components/FloatingWindow';
import { NotificationBar } from '../components/common/NotificationBar';

function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    dateRange: 'all',
    minQuantity: '',
    maxQuantity: '',
    clothesTypes: [],
    cities: [],
    availableCities: [],
    availableTypes: []
  });
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalItems: 0,
    totalBeneficiaries: 0,
    completionRate: 0
  });
  const [notification, setNotification] = useState({
    type: 'info',
    message: '',
    visible: false
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axiosInstance.get('/donations/public');
        const data = response.data;
        setDonations(data);
        
        // Extract unique cities and clothes types for filters
        const cities = [...new Set(data.map(d => d.city))];
        const types = [...new Set(data.map(d => d.clothesType))];
        
        setFilterSettings(prev => ({
          ...prev,
          availableCities: cities,
          availableTypes: types
        }));
        
        // Calculate stats
        const total = data.length;
        const items = data.reduce((sum, d) => sum + d.quantity, 0);
        const completed = data.filter(d => d.status === 'completed').length;
        
        setStats({
          totalDonations: total,
          totalItems: items,
          totalBeneficiaries: Math.floor(items * 0.8), // Estimate
          completionRate: total ? (completed / total) * 100 : 0
        });
      } catch (err) {
        setError('Failed to load donations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilterSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message, visible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const applyFilters = () => {
    const activeFilters = [];
    if (filterSettings.clothesTypes.length) activeFilters.push('types');
    if (filterSettings.cities.length) activeFilters.push('cities');
    if (filterSettings.minQuantity || filterSettings.maxQuantity) activeFilters.push('quantity');
    if (filterSettings.dateRange !== 'all') activeFilters.push('date');

    showNotification(
      'success',
      activeFilters.length
        ? `Filters applied: ${activeFilters.join(', ')}`
        : 'All filters cleared'
    );
  };

  const resetFilters = () => {
    setFilterSettings({
      dateRange: 'all',
      minQuantity: '',
      maxQuantity: '',
      clothesTypes: [],
      cities: [],
      availableCities: filterSettings.availableCities,
      availableTypes: filterSettings.availableTypes
    });
    showNotification('info', 'All filters have been reset');
  };

  const filteredDonations = donations.filter(donation => {
    if (filter !== 'all' && donation.status !== filter) return false;
    
    if (filterSettings.clothesTypes.length && 
        !filterSettings.clothesTypes.includes(donation.clothesType)) {
      return false;
    }
    
    if (filterSettings.cities.length && 
        !filterSettings.cities.includes(donation.city)) {
      return false;
    }
    
    if (filterSettings.minQuantity && 
        donation.quantity < Number(filterSettings.minQuantity)) {
      return false;
    }
    
    if (filterSettings.maxQuantity && 
        donation.quantity > Number(filterSettings.maxQuantity)) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        donation.title.toLowerCase().includes(query) ||
        donation.clothesType.toLowerCase().includes(query) ||
        donation.city.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <PageLayout
      title="Public Donations"
      subtitle="See how we're making a difference together"
    >
      <NotificationBar
        type={notification.type}
        message={notification.message}
        isVisible={notification.visible}
        onClose={hideNotification}
      />
      
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <LoadingSkeleton type="stats" />
              <LoadingSkeleton type="stats" />
              <LoadingSkeleton type="stats" />
              <LoadingSkeleton type="stats" />
            </>
          ) : (
            <>
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FiPackage className="text-blue-500" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Donations</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalDonations}
                    </h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FiTrendingUp className="text-green-500" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Items Donated</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalItems}
                    </h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <FiUsers className="text-yellow-500" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiaries</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalBeneficiaries}
                    </h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Completion Rate</p>
                  <Progress value={stats.completionRate} variant="success" size="lg" showLabel />
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search donations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          </div>
        </Card>

        {/* Advanced Filters Window */}
        <FloatingWindow
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Advanced Filters"
          onApply={applyFilters}
          onReset={resetFilters}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={filterSettings.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity Range
              </label>
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filterSettings.minQuantity}
                  onChange={(e) => handleFilterChange('minQuantity', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filterSettings.maxQuantity}
                  onChange={(e) => handleFilterChange('maxQuantity', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clothes Types
              </label>
              <div className="flex flex-wrap gap-2">
                {filterSettings.availableTypes?.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      const types = filterSettings.clothesTypes.includes(type)
                        ? filterSettings.clothesTypes.filter(t => t !== type)
                        : [...filterSettings.clothesTypes, type];
                      handleFilterChange('clothesTypes', types);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterSettings.clothesTypes.includes(type)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cities
              </label>
              <div className="flex flex-wrap gap-2">
                {filterSettings.availableCities?.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      const cities = filterSettings.cities.includes(city)
                        ? filterSettings.cities.filter(c => c !== city)
                        : [...filterSettings.cities, city];
                      handleFilterChange('cities', cities);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterSettings.cities.includes(city)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FloatingWindow>

        {/* Donations List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map(donation => (
              <motion.div
                key={donation._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {donation.title}
                  </h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p>Type: {donation.clothesType}</p>
                    <p>Quantity: {donation.quantity} items</p>
                    <p>Location: {donation.city}</p>
                    <p className="text-sm">
                      Status:{' '}
                      <span className={`font-medium ${
                        donation.status === 'completed' ? 'text-green-500' :
                        donation.status === 'accepted' ? 'text-blue-500' :
                        'text-yellow-500'
                      }`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Donations;