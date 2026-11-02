import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salonData } from '../data/salonData';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
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
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-sm py-4' : 'bg-[#0a0a0a] py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo points to /home */}
        <Link to="/home" className="text-xl font-bold tracking-tight text-white flex items-center gap-2 z-50">
          <span className="text-[#D4AF37]">✂</span> {salonData.name.toUpperCase()}
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <Link to="/home" className="hover:text-white transition-colors">Home</Link>
          <Link to="/categories" className="hover:text-white transition-colors">Services</Link>
          <Link to="/stylists" className="hover:text-white transition-colors">Stylists</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center space-x-4">
          {isLoggedIn && user ? (
            <>
              <Link 
                to={user.role === 'admin' ? '/admin' : user.role === 'groomer' ? '/groomer-dashboard' : '/home'} 
                className="flex items-center focus:outline-none"
                title={user.name}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-[#D4AF37] object-cover shadow-lg hover:opacity-80 transition" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/50 flex items-center justify-center hover:bg-[#D4AF37]/10 transition">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                )}
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-300 transition">
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="flex lg:hidden items-center space-x-4 z-50">
          {isLoggedIn && user && (
            <Link to={user.role === 'admin' ? '/admin' : user.role === 'groomer' ? '/groomer-dashboard' : '/home'} className="flex items-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-[#D4AF37] object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              )}
            </Link>
          )}

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
          <Link to="/home" onClick={closeMobileMenu} className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Home</Link>
          <Link to="/categories" onClick={closeMobileMenu} className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Services</Link>
          <Link to="/stylists" onClick={closeMobileMenu} className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Stylists</Link>
          <Link to="/contact" onClick={closeMobileMenu} className="text-2xl text-gray-300 hover:text-[#D4AF37] transition">Contact</Link>
          
          <div className="pt-8 border-t border-gray-800 w-1/2 text-center">
            {isLoggedIn && user ? (
              <button onClick={handleLogout} className="text-xl text-red-400 hover:text-red-300 transition">
                Logout
              </button>
            ) : (
              <Link to="/" onClick={closeMobileMenu} className="text-xl text-[#D4AF37] hover:text-white transition">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;