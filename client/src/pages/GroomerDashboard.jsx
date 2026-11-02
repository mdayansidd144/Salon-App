import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Reveal from '../components/Reveal';

const API_BASE = 'http://localhost:5000';

const GroomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [groomerName, setGroomerName] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // CRITICAL CHECK: If not a groomer, kick them out
    if (!token || user.role !== 'groomer') {
      toast.error('Access Denied: Groomers Only');
      navigate('/'); 
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(`${API_BASE}/api/appointments/groomer-dashboard`, { headers });
        const data = await res.json();
        
        if (data.success) {
          setAppointments(data.data.appointments);
          setGroomerName(data.data.groomerName);
          setEarnings(data.data.todayEarnings);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/appointments/${id}/complete`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Appointment completed!');
        setAppointments(prev => prev.map(apt => 
          apt._id === id ? { ...apt, status: 'completed' } : apt
        ));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating appointment');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#D4AF37]">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/10 pb-6 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome, {groomerName}</h1>
              <p className="text-gray-400">Here is your schedule for today.</p>
            </div>
            <div className="bg-[#151515] border border-[#D4AF37]/30 px-6 py-3 rounded-2xl">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Today's Earnings (70%)</p>
              <p className="text-3xl font-bold text-[#D4AF37]">₹{earnings}</p>
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Today's Appointments ({appointments.length})</h2>
          
          {appointments.length === 0 ? (
            <div className="bg-[#151515] border border-gray-800 p-10 rounded-2xl text-center">
              <p className="text-gray-400">No appointments scheduled for today.</p>
            </div>
          ) : (
            appointments.map((apt, index) => (
              <Reveal key={apt._id} delay={index * 0.1}>
                <div className="bg-[#151515] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-gray-700 transition-colors">
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2 text-center min-w-[100px]">
                      <p className="text-sm font-bold text-[#D4AF37]">{apt.startTime}</p>
                      <p className="text-xs text-gray-500">{apt.endTime}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{apt.serviceId}</h3>
                      <p className="text-sm text-gray-400">Duration: 30 mins</p>
                    </div>
                  </div>

                  <div className="md:border-l md:border-gray-800 md:pl-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-white font-medium">{apt.customer?.name}</p>
                    <p className="text-sm text-gray-400">{apt.customer?.phone}</p>
                  </div>

                  <div>
                    {apt.status === 'completed' ? (
                      <span className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-bold uppercase">
                        Completed
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleComplete(apt._id)}
                        className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-[#c4a032] transition-colors"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default GroomerDashboard;