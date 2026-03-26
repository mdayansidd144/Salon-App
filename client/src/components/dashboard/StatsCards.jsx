import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  Star,
  BarChart3,
  AlertCircle
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, loading }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-2xl font-bold mt-2">{value}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">{trend}% from last week</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
};

const StatsCards = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings?.toLocaleString() || '0',
      icon: Calendar,
      color: '#3B82F6',
      trend: stats?.bookingGrowth
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: '#10B981',
      trend: stats?.revenueGrowth
    },
    {
      title: 'Active Customers',
      value: stats?.totalCustomers?.toLocaleString() || '0',
      icon: Users,
      color: '#F59E0B',
      trend: stats?.customerGrowth
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating?.toFixed(1) || '0',
      icon: Star,
      color: '#EF4444',
      trend: stats?.ratingGrowth
    },
    {
      title: 'Today\'s Bookings',
      value: stats?.todayBookings?.toLocaleString() || '0',
      icon: Clock,
      color: '#8B5CF6',
      trend: null
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingBookings?.toLocaleString() || '0',
      icon: AlertCircle,
      color: '#EC489A',
      trend: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} loading={loading} />
      ))}
    </div>
  );
};

export default StatsCards;