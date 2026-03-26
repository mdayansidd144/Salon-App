import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../../services/api';

const RevenueChart = ({ period = 'week' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    try {
      const response = await api.get(`/dashboard/revenue-chart?period=${period}`);
      setData(response.data.data.revenue);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-80 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg text-sm ${
              chartType === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded-lg text-sm ${
              chartType === 'area'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-lg text-sm ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`₹${value}`, 'Revenue']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        )}

        {chartType === 'area' && (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`₹${value}`, 'Revenue']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stackId="2"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
          </AreaChart>
        )}

        {chartType === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`₹${value}`, 'Revenue']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3B82F6" />
            <Bar dataKey="bookings" fill="#10B981" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;