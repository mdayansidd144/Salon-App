import React from 'react';
import { salonData } from '../data/salonData';
import Reveal from './Reveal';

const Legacy = () => {
  return (
    <section className="py-24 bg-[#0f0f0f]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-2xl transform translate-x-4 translate-y-4 opacity-10"></div>
              <img 
                src="/view.jpg" 
                alt="Our Legacy" 
                className="relative z-10 w-full h-[450px] object-cover rounded-2xl shadow-2xl border border-white/20"
              />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div>
              <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-4">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                A Legacy of <br/> Sharp Looks.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {salonData.legacyText}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-white">10+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Years of Craft</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">5k+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Happy Clients</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Legacy;