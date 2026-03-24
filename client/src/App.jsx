import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PaymentStatus from './pages/PaymentStatus';
import PrivateRoute from './components/common/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route 
                path="/admin/*" 
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;