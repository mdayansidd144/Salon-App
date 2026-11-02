import React from 'react';
import { salonData } from '../data/salonData';
import Reveal from './Reveal';

const Process = () => {
  return (
    <section className="py-24 bg-[#0f0f0f] border-t border-gray-800/50 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-3">The Experience</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">How We Work</h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10">
          {salonData.processSteps.map((item, index) => (
            <Reveal key={index} delay={index * 0.2}>
              <div className="relative">
                <div className="absolute -top-10 -left-4 text-8xl font-bold text-gray-800/30 select-none z-0">
                  {item.step}
                </div>
                <div className="relative z-10 pt-4">
                  <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-4">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;