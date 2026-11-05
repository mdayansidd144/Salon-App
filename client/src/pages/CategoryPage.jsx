import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData'; 
import BookingModal from '../components/BookingModal'; 
import Reveal from '../components/Reveal';

const CategoryPage = () => {
  const { category } = useParams(); 
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
        
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{categoryData.title}</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">{categoryData.description}</p>
          </div>
        </Reveal>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryData.services?.map((service, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="bg-[#151515] border border-gray-800 rounded-3xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300 flex flex-col h-full p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{service.description}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                  <span className="text-[#D4AF37] font-bold text-lg">
                    {service.price ? `$${service.price}` : 'Contact for Price'}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedService(service.name);
                      setIsModalOpen(true);
                    }}
                    className="btn-gold px-6 py-2 text-sm"
                  >
                    Book Now
                  </button>
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