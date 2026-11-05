import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicesData } from '../data/servicesData'; 
import BookingModal from '../components/BookingModal'; 
import Reveal from '../components/Reveal';

const CategoryPage = () => {
  const { category } = useParams(); 
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Get the specific category data from servicesData
  const categoryData = servicesData[category];

  if (!categoryData) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-screen">
        <h1 className="text-3xl text-white mb-4">Category not found</h1>
        <Link to="/categories" className="btn-gold inline-block">Go Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-[#0f0f0f] min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Header with "Choose Later" Button */}
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-800 pb-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{categoryData.title}</h1>
              <p className="text-gray-400 max-w-2xl text-lg">{categoryData.description}</p>
            </div>
            <button 
              onClick={() => navigate('/categories')}
              className="mt-6 md:mt-0 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors px-6 py-2 rounded font-bold tracking-wider text-sm uppercase"
            >
              Choose Later
            </button>
          </div>
        </Reveal>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryData.services?.map((service, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="bg-[#151515] border border-gray-800 rounded-3xl overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 flex flex-col h-full">
                
                {/* 1. RESTORED PREVIOUS IMAGE LAYOUT */}
                {service.image && (
                  <div className="relative h-72 overflow-hidden bg-[#0a0a0a] p-3 flex items-center justify-center">
                    
                    {/* Blurred Background */}
                    <img 
                      src={service.image} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" 
                    />
                    
                    {/* Sharp Foreground Image */}
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="relative w-full h-full object-contain rounded-xl border-2 border-white/20 group-hover:scale-105 transition-transform duration-700 z-10 shadow-2xl" 
                    />

                    {/* Price Badge Top Right */}
                    <div className="absolute top-6 right-6 bg-[#0a0a0a]/90 border border-[#D4AF37]/50 backdrop-blur-md px-3 py-1 rounded-full z-20">
                      <span className="text-[#D4AF37] font-bold text-sm">
                        {service.price ? `₹${service.price}` : 'Price'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-gray-400 mb-6 flex-grow text-sm">{service.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                    <button 
                      onClick={() => {
                        setSelectedService(service.name);
                        setIsModalOpen(true);
                      }}
                      className="btn-gold px-6 py-2 text-sm w-full"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          service={selectedService}
          category={categoryData.title}
        />
      )}
    </div>
  );
};

export default CategoryPage;