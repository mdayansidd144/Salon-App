import React from 'react';
import { Link } from 'react-router-dom';
import { salonData } from '../data/salonData';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-6">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-10 h-10 object-cover rounded-full border border-[#D4AF37] bg-white" 
            />
            <span className="text-xl font-bold tracking-tight text-white">
              {salonData.name.toUpperCase()}
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            We Make Your Hair Look Great, Perfect!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-[#D4AF37] transition">Home</Link></li>
            <li><Link to="/categories" className="hover:text-[#D4AF37] transition">Services</Link></li>
            <li><Link to="/stylists" className="hover:text-[#D4AF37] transition">Our Team</Link></li>
            {/* NEW LINKS ADDED HERE */}
            <li><Link to="/privacy-policy" className="hover:text-[#D4AF37] transition">Privacy Policy</Link></li>
            <li><Link to="/help" className="hover:text-[#D4AF37] transition">Help Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Contact</h4>
          <div className="text-gray-400 text-sm space-y-4">
            <p>BBD Opposite Goel Complex,<br />Second Floor, 1st Shop</p>
            <p>
              <span className="text-[#D4AF37] font-medium">Mohd Umar:</span> 9519159639
            </p>
            <p>
              <span className="text-[#D4AF37] font-medium">Mohd Arish:</span> 6393790278
            </p>
          </div>
        </div>

        {/* Opening Hours */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Opening Hours</h4>
          <div className="flex justify-between items-center text-sm text-gray-400 border-b border-gray-800 pb-3">
            <span>Mon - Sun</span>
            <span className="text-white font-medium">10AM - 10PM</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;