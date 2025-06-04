import { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { DonationChart } from '../components/dashboard/DonationChart';
import { Card } from '../components/cards/Card';
import { Progress } from '../components/common/Progress';
import { StaggeredList } from '../components/animations/StaggeredList';
import { FadeIn } from '../components/animations/FadeIn';
import axiosInstance from '../utils/axiosInstance';

const ImpactPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impactData, setImpactData] = useState({
    monthlyDonations: [],
    totalImpact: {
      clothes: 0,
      beneficiaries: 0,
      co2Saved: 0,
      recyclingRate: 0,
      waterSaved: 0,
      energySaved: 0,
      landfillSaved: 0
    },
    achievements: []
  });

  useEffect(() => {
    const fetchImpactData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/impact/user');
        setImpactData(response.data);
      } catch (error) {
        console.error('Error fetching impact data:', error);
        setError(error.userMessage || 'Failed to load impact data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  const impactMetrics = [
    {
      label: 'Items Donated',
      value: impactData.totalImpact.clothes,
      icon: '👕',
      description: 'Total pieces of clothing donated',
      color: 'bg-blue-500'
    },
    {
      label: 'People Helped',
      value: impactData.totalImpact.beneficiaries,
      icon: '🤝',
      description: 'Number of beneficiaries reached',
      color: 'bg-green-500'
    },
    {
      label: 'CO₂ Saved',
      value: `${impactData.totalImpact.co2Saved}kg`,
      icon: '🌱',
      description: 'Reduction in carbon footprint',
      color: 'bg-emerald-500'
    }
  ];

  if (error) {
    return (
      <PageLayout
        title="Your Impact"
        subtitle="See how your donations are making a difference"
      >
        <div className="p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg dark:bg-red-900/50 dark:border-red-800 dark:text-red-200">
          {error}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Your Impact"
      subtitle="See how your donations are making a difference"
    >
      <div className="space-y-8">
        {/* Impact Overview */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactMetrics.map((metric) => (
            <Card key={metric.label} className="p-6">
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {metric.value}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.label}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {metric.description}
              </p>
            </Card>
          ))}
        </StaggeredList>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn>
            <DonationChart
              title="Monthly Donations"
              subtitle="Number of items donated per month"
              data={impactData.monthlyDonations}
              loading={isLoading}
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Recycling Impact
              </h3>
              <div className="space-y-8">
                <div>
                  <Progress
                    value={impactData.totalImpact.recyclingRate}
                    variant="success"
                    size="lg"
                    showLabel
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {impactData.totalImpact.recyclingRate}% of your donations were successfully recycled
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Environmental Benefits
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Water Saved</span>
                        <span>{impactData.totalImpact.waterSaved.toLocaleString()} L</span>
                      </div>
                      <Progress value={75} variant="info" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Energy Conserved</span>
                        <span>{impactData.totalImpact.energySaved.toLocaleString()} kWh</span>
                      </div>
                      <Progress value={60} variant="warning" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Landfill Space Saved</span>
                        <span>{impactData.totalImpact.landfillSaved.toLocaleString()} m³</span>
                      </div>
                      <Progress value={45} variant="primary" size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>

        {/* Achievement Cards */}
        <FadeIn delay={0.4}>
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Your Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {impactData.achievements.map((achievement) => (
                <div
                  key={achievement.label}
                  className={`text-center p-4 rounded-lg border-2 ${
                    achievement.unlocked
                      ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-50'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{achievement.icon}</span>
                  <span className="text-sm font-medium block text-gray-900 dark:text-white">
                    {achievement.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      </div>
    </PageLayout>
  );
};

export default ImpactPage;