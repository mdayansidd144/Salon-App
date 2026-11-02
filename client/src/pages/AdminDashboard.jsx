import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Reveal from '../components/Reveal';

const API_BASE = 'http://localhost:5000';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, todayBookings: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments'); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // CRITICAL CHECK: If not an admin, kick them out
    if (!token || user.role !== 'admin') {
      toast.error('Access Denied: Admins Only');
      navigate('/'); 
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const [aptsRes, statsRes, msgRes] = await Promise.all([
          fetch(`${API_BASE}/api/appointments`, { headers }),
          fetch(`${API_BASE}/api/dashboard/stats`, { headers }),
          fetch(`${API_BASE}/api/contact`, { headers })
        ]);
        
        const aptsData = await aptsRes.json();
        const statsData = await statsRes.json();
        const msgData = await msgRes.json();
        
        if (aptsData.success) setAppointments(aptsData.data);
        if (statsData.success) setStats(statsData.data);
        if (msgData.success) setMessages(msgData.data);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#D4AF37]">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        
        <Reveal>
          <div className="mb-10 border-b border-white/10 pb-6">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage appointments, revenue, and messages.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Reveal delay={0.1}>
            <div className="bg-[#151515] border border-gray-800 p-6 rounded-2xl h-full">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Revenue</p>
              <p className="text-4xl font-bold text-[#D4AF37]">₹{stats.totalRevenue || 0}</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="bg-[#151515] border border-gray-800 p-6 rounded-2xl h-full">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Bookings</p>
              <p className="text-4xl font-bold text-white">{stats.totalBookings || 0}</p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="bg-[#151515] border border-gray-800 p-6 rounded-2xl h-full">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Today's Bookings</p>
              <p className="text-4xl font-bold text-white">{stats.todayBookings || 0}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.35}>
          <div className="flex gap-8 border-b border-gray-800 mb-6">
            <button 
              onClick={() => setActiveTab('appointments')} 
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'appointments' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
            >
              APPOINTMENTS
            </button>
            <button 
              onClick={() => setActiveTab('messages')} 
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'messages' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
            >
              MESSAGES ({messages.length})
            </button>
          </div>
        </Reveal>

        {activeTab === 'appointments' && (
          <Reveal delay={0.4}>
            <div className="bg-[#151515] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0a0a0a] text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {appointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{apt.customer?.name}</p>
                          <p className="text-xs text-gray-500">{apt.customer?.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white">{apt.serviceId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white">{apt.date ? new Date(apt.date).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-xs text-gray-500">{apt.startTime}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#D4AF37]">₹{apt.amount || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            apt.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                            apt.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                            'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No appointments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        )}

        {activeTab === 'messages' && (
          <Reveal delay={0.4}>
            <div className="bg-[#151515] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0a0a0a] text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Sender</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {messages.map((msg) => (
                      <tr key={msg._id} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{msg.name}</td>
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">{msg.email}</p>
                          <p className="text-xs text-gray-500">{msg.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm max-w-md whitespace-pre-wrap">{msg.message}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No messages yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;