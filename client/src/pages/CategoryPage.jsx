import React, { useState, useEffect } from 'react';
import { servicesData } from '../data/servicesData';
import BookingModal from '../components/BookingModal';
import Reveal from '../components/Reveal';

const CategoryPage = () => {
  const [category, setCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  
  const categoryKey = window.location.pathname.split('/').pop();

  useEffect(() => {
    if (servicesData[categoryKey]) setCategory(servicesData[categoryKey]);
  }, [categoryKey]);

  if (!category) return <div className="pt-32 text-center text-gray-500 min-h-screen bg-[#0f0f0f]">Loading...</div>;
  const chooseLaterService = {
    id: `${categoryKey}_later`,
    name: `Choose Later (${category.title} Consultation)`,
    price: category.services[0]?.price || 100,
    duration: category.services[0]?.duration || 30,
    description: 'Not sure what you want? Book a slot and decide with your barber.',
    image: category.image
  };

  return (
    <div className="pt-32 pb-20 bg-[#0f0f0f] min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <Reveal>
          <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{category.title}</h1>
              <p className="text-gray-400 text-lg">{category.description}</p>
            </div>
            
            {/* CHOOSE LATER BUTTON */}
            <button 
              onClick={() => setSelectedService(chooseLaterService)}
              className="px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-[#c4a032] transition-colors shadow-lg whitespace-nowrap"
            >
              Choose Later
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.1}>
              <div 
                className="bg-[#151515] border border-gray-800 rounded-3xl overflow-hidden group cursor-pointer hover:border-[#D4AF37] transition-all duration-300 flex flex-col h-full" 
                onClick={() => setSelectedService(service)}
              >
                <div className="relative h-64 overflow-hidden bg-[#0a0a0a] p-3 flex items-center justify-center">
                  
                  <img 
                    src={service.image} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" 
                  />
                  
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="relative w-full h-full object-contain rounded-xl border-2 border-white group-hover:scale-105 transition-transform duration-700 z-10 shadow-2xl" 
                  />
                  
                  <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-[#D4AF37] border border-white shadow-lg z-20">
                    ₹{service.price}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{service.duration} min</span>
                    <button className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider group-hover:text-white transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {selectedService && (
        <BookingModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
};

export default CategoryPage;