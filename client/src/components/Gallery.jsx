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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
          {/* Large Image 1 */}
          <Reveal delay={0.1} className="col-span-2 row-span-2">
            <div className="relative rounded-2xl overflow-hidden group w-full h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img src={salonData.images.gallery[0]} alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            </div>
          </Reveal>

          {/* Top Right Small Image 1 */}
          <Reveal delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden group w-full h-[200px] md:h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img src={salonData.images.gallery[1]} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            </div>
          </Reveal>

          {/* Top Right Small Image 2 */}
          <Reveal delay={0.3}>
            <div className="relative rounded-2xl overflow-hidden group w-full h-[200px] md:h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img src={salonData.images.gallery[2]} alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            </div>
          </Reveal>

          {/* Bottom Right Small Image 1 */}
          <Reveal delay={0.4}>
            <div className="relative rounded-2xl overflow-hidden group w-full h-[200px] md:h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img src={salonData.images.gallery[3]} alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            </div>
          </Reveal>

          {/* Bottom Right Small Image 2 */}
          <Reveal delay={0.5}>
            <div className="relative rounded-2xl overflow-hidden group w-full h-[200px] md:h-full border-2 border-white/10 hover:border-[#D4AF37] transition-colors">
              <img src={salonData.images.gallery[4]} alt="Gallery 5" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Gallery;