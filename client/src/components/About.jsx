import React from 'react';
import { salonData } from '../data/salonData';
import Reveal from './Reveal';

const About = () => {
  return (
    <section id="about" className="py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image */}
          <Reveal delay={0.1}>
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-2xl transform translate-x-4 translate-y-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-white shadow-2xl">
                <img 
                  src={salonData.images.about} 
                  alt="Inside the barbershop" 
                  className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal delay={0.3}>
            <div>
              <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-4">Our Legacy</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Crafting Confidence <br/> Through Sharp Style.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {salonData.aboutText}
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                {salonData.description}
              </p>
              
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                  <p className="text-3xl font-bold text-white mb-1">10+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Years of Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-1">5k+</p>
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

export default About;