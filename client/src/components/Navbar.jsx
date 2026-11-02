import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salonData } from '../data/salonData';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check login status
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-sm py-4' : 'bg-[#0a0a0a] py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="text-[#D4AF37]">✂</span> {salonData.name.toUpperCase()}
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/categories" className="hover:text-white transition-colors">Services</Link>
          <Link to="/stylists" className="hover:text-white transition-colors">Stylists</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          
          {isLoggedIn && user ? (
            // ONLY show Profile Icon when logged in (Logout removed)
            <Link 
              to={user.role === 'admin' ? '/admin' : user.role === 'groomer' ? '/groomer-dashboard' : '/'} 
              className="flex items-center focus:outline-none"
              title={user.name}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full border-2 border-[#D4AF37] object-cover shadow-lg hover:opacity-80 transition"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/50 flex items-center justify-center hover:bg-[#D4AF37]/10 transition">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              )}
            </Link>
          ) : (
            // ONLY show Login when logged out (Book Now removed)
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;