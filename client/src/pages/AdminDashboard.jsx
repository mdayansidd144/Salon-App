import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Scissors, 
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Download,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import StatsCards from '../components/dashboard/StatsCards';
import RevenueChart from '../components/dashboard/RevenueChart';
import AppointmentCalendar from '../components/dashboard/AppointmentCalendar';
import RecentBookings from '../components/dashboard/RecentBookings';
import PopularServices from '../components/dashboard/PopularServices';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isConnected, on } = useSocket();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for real-time updates
    const unsubscribe = on('dashboard-stats-update', (newStats) => {
      setStats(newStats);
      setNotifications(prev => [{
        id: Date.now(),
        message: 'Dashboard stats updated',
        timestamp: new Date(),
        read: false
      }, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await api.get(`/dashboard/export?type=${type}&period=${dateRange}`);
      toast.success('Report generated successfully');
      // Download logic here
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Real-time status */}
              <div className={`flex items-center gap-2 text-sm ${
                isConnected ? 'text-green-600' : 'text-yellow-600'
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`} />
                <span>{isConnected ? 'Live' : 'Connecting...'}</span>
              </div>

              {/* Refresh button */}
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-gray-600 transition"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-gray-500">No notifications</p>
                      ) : (
                        notifications.map(notification => (
                          <div key={notification.id} className="p-3 border-b hover:bg-gray-50">
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Export */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block">
                  <button
                    onClick={() => handleExport('appointments')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Appointments
                  </button>
                  <button
                    onClick={() => handleExport('revenue')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Revenue Report
                  </button>
                  <button
                    onClick={() => handleExport('services')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Services Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 transition
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <StatsCards stats={stats} loading={loading} />

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <RevenueChart period={dateRange} />
                </div>
                <div>
                  <PopularServices />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentBookings />
                <AppointmentCalendar />
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AppointmentManager />
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ServiceManager />
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CustomerManager />
            </motion.div>
          )}

          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FeedbackManager />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SettingsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;