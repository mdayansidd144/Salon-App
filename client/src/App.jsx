import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import StylistsPage from './pages/StylistsPage';
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';
import GroomerDashboard from './pages/GroomerDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpUs from './pages/HelpUs';

const AppContent = () => {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // List of main pages where we WANT the full loading screen
  const mainPages = ['/', '/home', '/categories', '/stylists', '/contact', '/privacy-policy', '/help'];

  useEffect(() => {
    const isMainPage = mainPages.includes(location.pathname);

    if (isMainPage) {
      // Whenever the URL changes to a main page, show the loading screen
      setIsPageLoading(true);
    } else {
      // Skip loading screen for sub-pages (like specific services)
      setIsPageLoading(false);
    }
  }, [location.pathname]); // Triggers on link clicks AND back/forward buttons

  return (
    <div className="min-h-screen bg-[#0f0f0f] relative">
      
      {/* The LoadingScreen controls its own timer and tells AppContent when to hide it */}
      {isPageLoading && (
        <div className="fixed inset-0 z-[9999]">
          <LoadingScreen onComplete={() => setIsPageLoading(false)} />
        </div>
      )}

      <Navbar />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/stylists" element={<StylistsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<HelpUs />} />

        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/groomer-dashboard" element={<GroomerDashboard />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;