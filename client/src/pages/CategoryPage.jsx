import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { salonData } from '../data/salonData'; 
import BookingModal from '../components/BookingModal'; 

const CategoryPage = () => {
  const { category } = useParams(); 
  const [categoryData, setCategoryData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Look inside the categories array
    const categories = salonData.categories || [];
    
    // Clean the URL parameter (e.g., "beard" -> "beard")
    const cleanCategory = category.toLowerCase().replace(/[\s-]/g, '');

    const foundCategory = categories.find(
      (c) => c.id.toLowerCase().replace(/[\s-]/g, '') === cleanCategory
    );

    setCategoryData(foundCategory || null);
  }, [category]);

  if (!categoryData) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-screen">
        <h1 className="text-3xl text-white mb-4">Category "{category}" not found</h1>
        <p className="text-gray-400 mb-8">Please check the categories array in your salonData.js file.</p>
        <Link to="/" className="btn-gold inline-block">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
      
      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {categoryData.title}
        </h1>
        <p className="text-gray-400 max-w-2xl">
          {categoryData.description}
        </p>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.services && categoryData.services.length > 0 ? (
          categoryData.services.map((service, index) => (
            <div key={index} className="bg-[#151515] border border-gray-800 rounded-2xl p-6 hover:border-[#D4AF37] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="text-[#D4AF37] font-bold text-lg">
                  ${service.price}
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
          ))
        ) : (
          <p className="text-gray-400">No services available for this category.</p>
        )}
      </div>

      {/* Render the Booking Modal */}
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