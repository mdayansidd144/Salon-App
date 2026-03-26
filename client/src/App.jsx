import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Simple Home Page
const Home = () => {
  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      toast.success('✅ Backend is running!');
      console.log('Backend response:', data);
    } catch (error) {
      toast.error('❌ Backend not running. Start server with: node server.js');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px' }}>
          ✂️ Salon Pro
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px' }}>
          Professional Grooming at Your Fingertips
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/book" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>
            Book Now
          </Link>
          <button onClick={testBackend} style={{ backgroundColor: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Test Backend
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Booking Page
const Booking = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedService, setSelectedService] = React.useState(null);
  const [customerName, setCustomerName] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [bookingLoading, setBookingLoading] = React.useState(false);

  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data.data || []);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Please fill all customer details');
      return;
    }

    setBookingLoading(true);
    try {
      const appointmentData = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        serviceId: selectedService.id || selectedService._id,
        date: new Date().toISOString().split('T')[0],
        timeSlot: '10:00',
        notes: ''
      };

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Appointment booked successfully!');
        setSelectedService(null);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (error) {
      toast.error('Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Book Appointment</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Services List */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Select Service</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.map(service => (
              <div
                key={service.id || service._id}
                onClick={() => setSelectedService(service)}
                style={{
                  border: selectedService?.id === service.id || selectedService?._id === service._id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  backgroundColor: selectedService?.id === service.id || selectedService?._id === service._id ? '#eff6ff' : 'white'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{service.name}</h3>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>{service.duration} minutes</p>
                <p style={{ color: '#3b82f6', fontSize: '20px', fontWeight: 'bold', marginTop: '8px' }}>₹{service.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Form */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Your Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Full Name *"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
            <input
              type="email"
              placeholder="Email Address *"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
            <button
              onClick={handleBooking}
              disabled={bookingLoading || !selectedService}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: bookingLoading || !selectedService ? 'not-allowed' : 'pointer',
                opacity: bookingLoading || !selectedService ? 0.6 : 1
              }}
            >
              {bookingLoading ? 'Booking...' : `Book Now - ₹${selectedService?.price || 0}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Login Page
const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/admin';
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '24px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
          Default: admin@salon.com / admin123
        </p>
      </div>
    </div>
  );
};

// Simple Admin Dashboard
const AdminDashboard = () => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchStats();
    fetchAppointments();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (error) {
      console.error('Failed to load appointments');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Bookings</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{stats?.totalBookings || 0}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Today's Bookings</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats?.todayBookings || 0}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Pending</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{stats?.pendingBookings || 0}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Revenue</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>₹{stats?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Appointments</h2>
        {appointments.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>No appointments yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Service</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 10).map(apt => (
                  <tr key={apt._id || apt.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>{apt.customerName || apt.customer?.name}</td>
                    <td style={{ padding: '12px' }}>{apt.serviceName || apt.service?.name}</td>
                    <td style={{ padding: '12px' }}>{apt.date?.split('T')[0] || apt.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        backgroundColor: apt.status === 'confirmed' ? '#d1fae5' : apt.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                        color: apt.status === 'confirmed' ? '#065f46' : apt.status === 'cancelled' ? '#991b1b' : '#92400e'
                      }}>
                        {apt.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Navbar
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast.success('Logged out');
    window.location.href = '/';
  };

  return (
    <nav style={{ backgroundColor: '#3b82f6', color: 'white', padding: '16px 32px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>✂️ Salon Pro</Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/book" style={{ color: 'white', textDecoration: 'none' }}>Book</Link>
          {isLoggedIn ? (
            <>
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
