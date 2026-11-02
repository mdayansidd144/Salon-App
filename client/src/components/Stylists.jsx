import React from 'react';
import { salonData } from '../data/salonData';
import Reveal from './Reveal';

const Stylists = () => {
  return (
    <section id="stylists" className="py-24 bg-[#0a0a0a] min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-3">The Team</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Meet Our Master Groomers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Two brothers, one passion - delivering the finest grooming experience.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {salonData.stylists.map((barber, index) => (
            <Reveal key={barber.name} delay={index * 0.2}>
              <div className="bg-[#151515] border border-white/10 rounded-3xl overflow-hidden group hover:border-[#D4AF37] transition-colors duration-300 flex flex-col h-full shadow-2xl">
                
                {/* Image Container with padding and object-contain */}
                <div className="relative h-[500px] overflow-hidden bg-[#0a0a0a] p-4 flex items-center justify-center">
                  
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="h-full w-auto object-contain border-2 border-white rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-700 z-10"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-80 z-20 pointer-events-none" />
                  
                  <div className="absolute top-6 right-6 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-30">
                    {barber.experience}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow relative -mt-12 z-30">
                  <div className="bg-[#151515]/95 backdrop-blur-md rounded-2xl p-8 border border-white/10 h-full shadow-xl">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">{barber.name}</h3>
                        <p className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mt-2">{barber.role}</p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {barber.description}
                    </p>

                    <div className="mb-8">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Specializes In</p>
                      <div className="flex flex-wrap gap-2">
                        {barber.expertise.map(skill => (
                          <span key={skill} className="bg-gray-800/80 text-gray-300 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <span className="text-white text-sm font-medium italic">"{barber.quote}"</span>
                      <div className="flex items-center gap-1 text-[#D4AF37] font-bold text-sm bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                        <span>⭐ {barber.rating}</span>
                        <span className="text-gray-500 font-normal">({barber.reviews} reviews)</span>
                      </div>
                    </div>
                    
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stylists;