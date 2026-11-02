import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import Reveal from '../components/Reveal';

const CategoriesPage = () => {
  return (
    <div className="pt-32 pb-20 bg-[#0f0f0f] min-h-screen">
      <div className="container mx-auto px-6">
        
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-3">What We Offer</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Premium Services</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Select a category to explore our curated grooming packages.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(servicesData).map(([key, category], index) => (
            <Reveal key={key} delay={index * 0.1}>
              <Link to={`/category/${key}`} className="bg-[#151515] border border-gray-800 rounded-3xl overflow-hidden group cursor-pointer hover:border-[#D4AF37] transition-all duration-300 flex flex-col h-full">
                
                {/* FIXED IMAGE CONTAINER */}
                <div className="relative h-64 overflow-hidden bg-[#0a0a0a] p-3 flex items-center justify-center">
                  
                  {/* 1. Blurred Background Layer */}
                  <img 
                    src={category.image} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" 
                  />
                  
                  {/* 2. Sharp Foreground Image Layer */}
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="relative w-full h-full object-contain rounded-xl border-2 border-white group-hover:scale-105 transition-transform duration-700 z-10 shadow-2xl" 
                  />
                  
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{category.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow">{category.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-[#D4AF37] font-bold text-sm uppercase tracking-wider">
                      {category.services?.length || 0} Options
                    </span>
                    <span className="text-white font-bold group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>

              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;