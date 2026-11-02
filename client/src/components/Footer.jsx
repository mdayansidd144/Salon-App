import React from 'react';
import { Link } from 'react-router-dom';
import { salonData } from '../data/salonData';
import Reveal from './Reveal';

const Footer = () => {
  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-gray-800 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <Reveal delay={0.1}>
            <div className="md:col-span-1">
              <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-6">
                <span className="text-[#D4AF37]">✂</span> {salonData.name.toUpperCase()}
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {salonData.tagline}
              </p>
            </div>
          </Reveal>

          {/* Links */}
          <Reveal delay={0.2}>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link to="/" className="hover:text-[#D4AF37] transition">Home</Link></li>
                <li><Link to="/categories" className="hover:text-[#D4AF37] transition">Services</Link></li>
                <li><Link to="/stylists" className="hover:text-[#D4AF37] transition">Our Team</Link></li>
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.3}>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="leading-relaxed">{salonData.contact.address}</li>
                <li className="pt-2">
                  <span className="text-[#D4AF37] font-semibold">Mohd Umar:</span> {salonData.contact.umarPhone}
                </li>
                <li>
                  <span className="text-[#D4AF37] font-semibold">Mohd Arish:</span> {salonData.contact.arishPhone}
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Hours */}
          <Reveal delay={0.4}>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Opening Hours</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Mon - Sun</span>
                  <span className="text-white">10AM - 10PM</span>
                </li>
              </ul>
            </div>
          </Reveal>

        </div>

        <Reveal delay={0.5}>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} {salonData.name}. All rights reserved.
            </p>
          </div>
        </Reveal>

      </div>
    </footer>
  );
};

export default Footer;