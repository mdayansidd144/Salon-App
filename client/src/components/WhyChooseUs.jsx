import React from 'react';
import { salonData } from '../data/salonData';
import Reveal from './Reveal';

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-gray-800/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-3">Why Choose Us</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">The Cut For You Difference</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {salonData.features.map((feature, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="bg-[#151515] border border-gray-800 p-8 rounded-2xl h-full hover:border-[#D4AF37] transition-colors duration-300">
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;