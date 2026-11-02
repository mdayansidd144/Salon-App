import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import StylistsPage from './pages/StylistsPage';
import AdminLogin from './pages/AdminLogin'; // Unified Login
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';
import GroomerDashboard from './pages/GroomerDashboard';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen bg-[#0f0f0f]">
          <Navbar />
          <Toaster position="bottom-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/stylists" element={<StylistsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Single Login Route */}
            <Route path="/login" element={<AdminLogin />} />
            
            {/* Dashboards */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/groomer-dashboard" element={<GroomerDashboard />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;