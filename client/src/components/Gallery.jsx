import React from 'react';
import { salonData } from '../data/salonData';
import Reveal from './Reveal';

const Gallery = () => {
  return (
    <section className="py-24 bg-[#0f0f0f]">
      <div className="container mx-auto px-6 max-w-7xl">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-3">Our Craft</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white">The Art of Grooming</h2>
            </div>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              A glimpse into our daily work. From precise fades to classic hot towel shaves, we take pride in every detail.
            </p>
          </div>
        </Reveal>

        {/* Grid layout designed for exactly 4 images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[600px]">
          
          {/* Large Featured Image (Takes up 2 rows on desktop) */}
          <Reveal delay={0.1} className="md:col-span-1 md:row-span-2 h-[300px] md:h-full">
            <div className="relative rounded-2xl overflow-hidden group w-full h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img 
                src={salonData.images.gallery[0]} 
                alt="Gallery Featured" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
              />
            </div>
          </Reveal>

          {/* Top Right Image */}
          <Reveal delay={0.2} className="md:col-span-2 h-[250px] md:h-full">
            <div className="relative rounded-2xl overflow-hidden group w-full h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img 
                src={salonData.images.gallery[1]} 
                alt="Gallery 2" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
              />
            </div>
          </Reveal>

          {/* Bottom Right Image 1 */}
          <Reveal delay={0.3} className="md:col-span-1 h-[250px] md:h-full">
            <div className="relative rounded-2xl overflow-hidden group w-full h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img 
                src={salonData.images.gallery[2]} 
                alt="Gallery 3" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
              />
            </div>
          </Reveal>

          {/* Bottom Right Image 2 */}
          <Reveal delay={0.4} className="md:col-span-1 h-[250px] md:h-full">
            <div className="relative rounded-2xl overflow-hidden group w-full h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img 
                src={salonData.images.gallery[3]} 
                alt="Gallery 4" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
              />
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default Gallery;