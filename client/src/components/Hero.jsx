import React from 'react';
import { Link } from 'react-router-dom';
import { salonData } from '../data/salonData';

const Hero = () => {
  return (
    <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={salonData.images.hero}
          alt="Barber Shop"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
        <p className="text-[#D4AF37] tracking-[0.3em] uppercase text-sm font-bold mb-6">
          Haircut & Barber
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tighter leading-none mb-6">
          Your Style <br />
          Starts Here.
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
          We are located at 123 Main Street. Walk in for a classic cut or book an appointment with our master groomers.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/categories" className="btn-gold min-w-[200px] text-center">
            Book Now
          </Link>
          <Link to="/categories" className="px-8 py-3 border border-white/40 text-white font-semibold uppercase tracking-wider rounded-lg hover:bg-white hover:text-black transition-all duration-300 min-w-[200px] text-center">
            Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;