import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';

export const DonationChart = ({
  data = [],
  title,
  subtitle,
  type = 'bar', // 'bar' | 'line'
  loading = false,
  className = ''
}) => {
  const chartRef = useRef(null);
  const maxValue = Math.max(...data.map(item => item.value));

  const getHeight = (value) => {
    return (value / maxValue) * 200; // 200px max height
  };

  return (
    <Card className={`p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-[250px] bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ) : (
          <div className="relative h-[250px]" ref={chartRef}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
              {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0].map((value) => (
                <div key={value} className="text-right pr-2">
                  {Math.round(value)}
                </div>
              ))}
            </div>

            {/* Chart grid */}
            <div className="absolute left-12 right-0 top-0 bottom-0">
              {[0.75, 0.5, 0.25].map((value) => (
                <div
                  key={value}
                  className="absolute w-full border-t border-gray-100 dark:border-gray-800"
                  style={{ top: `${100 - value * 100}%` }}
                />
              ))}
            </div>

            {/* Chart bars or line */}
            <div className="absolute left-12 right-0 bottom-0 flex items-end justify-around">
              {data.map((item, index) => (
                <div
                  key={item.label}
                  className="relative flex flex-col items-center group"
                  style={{ height: '200px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </div>

                  {/* Bar or point */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: getHeight(item.value) }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`w-12 rounded-t ${
                      type === 'bar'
                        ? 'bg-primary-500 dark:bg-primary-400'
                        : 'w-3 h-3 rounded-full bg-primary-500'
                    }`}
                  />

                  {/* X-axis label */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};