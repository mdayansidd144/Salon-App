import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { salonData } from '../data/salonData';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-sm py-2' : 'bg-[#0a0a0a] py-4'}`}>
      
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* UPDATED LOGO SECTION */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="w-10 h-10 object-cover rounded-full border border-[#D4AF37] bg-white" 
          />
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
            {salonData.name.toUpperCase()}
          </span>
        </Link>
        
        {/* Desktop Navigation (Centered) */}
        <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8 text-sm font-medium text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/categories" className="hover:text-white transition-colors">Services</Link>
          <Link to="/stylists" className="hover:text-white transition-colors">Stylists</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Mobile Hamburger Icon */}
        <div className="flex lg:hidden items-center z-50">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden fixed inset-x-0 top-0 pt-20 bg-[#0a0a0a]/98 backdrop-blur-lg transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} h-screen`}>
        <nav className="flex flex-col items-center justify-center space-y-8 mt-10">
          <Link to="/" className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Home</Link>
          <Link to="/categories" className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Services</Link>
          <Link to="/stylists" className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Stylists</Link>
          <Link to="/contact" className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;