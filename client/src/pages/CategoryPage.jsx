import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { salonData } from '../data/salonData'; 
import BookingModal from '../components/BookingModal'; // Ensure this path is correct based on your folder structure

const CategoryPage = () => {
  const { category } = useParams(); 
  const [categoryData, setCategoryData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (!salonData) return;

    // Clean the URL parameter (e.g., "beard-trim" -> "beardtrim")
    const cleanCategory = category.toLowerCase().replace(/[\s-]/g, '');

    // Convert salonData to an array if it's currently an object
    const dataArray = Array.isArray(salonData) ? salonData : Object.values(salonData);

    // Find the matching category
    const foundCategory = dataArray.find((item) => {
      if (!item) return false;
      
      const itemId = item.id ? String(item.id).toLowerCase().replace(/[\s-]/g, '') : '';
      const itemTitle = item.title ? String(item.title).toLowerCase().replace(/[\s-]/g, '') : '';
      const itemName = item.name ? String(item.name).toLowerCase().replace(/[\s-]/g, '') : '';

      return itemId === cleanCategory || itemTitle === cleanCategory || itemName === cleanCategory;
    });

    if (foundCategory) {
      setCategoryData(foundCategory);
    } else {
      // Fallback: If the category isn't found, just show the first one so it's not blank
      setCategoryData(dataArray[0] || null);
    }
  }, [category]);

  if (!categoryData) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-screen">
        <h1 className="text-3xl text-white mb-4">Category not found</h1>
        <p className="text-gray-400 mb-8">Please check your salonData.js file.</p>
        <Link to="/" className="btn-gold inline-block">Go Back Home</Link>
      </div>
    );
  }

  // Safely extract services regardless of how the data is structured
  const services = categoryData.services || categoryData.items || [];

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
      
      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {categoryData.title || categoryData.name || category}
        </h1>
        <p className="text-gray-400 max-w-2xl">
          {categoryData.description || "Choose from our premium selection of services below."}
        </p>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.map((service, index) => (
            <div key={index} className="bg-[#151515] border border-gray-800 rounded-2xl p-6 hover:border-[#D4AF37] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.name || service.title || service}
                </h3>
                {service.description && (
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                )}
              </div>
              <div className="flex justify-between items-center mt-6">
                {service.price && (
                  <span className="text-[#D4AF37] font-bold text-lg">
                    ${service.price}
                  </span>
                )}
                <button 
                  onClick={() => {
                    setSelectedService(service.name || service.title || service);
                    setIsModalOpen(true);
                  }}
                  className="btn-gold px-6 py-2 text-sm ml-auto"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-400">No specific services listed for this category yet.</p>
            <button 
              onClick={() => {
                setSelectedService(categoryData.title || categoryData.name || category);
                setIsModalOpen(true);
              }}
              className="btn-gold px-6 py-3 mt-4"
            >
              Book This Category
            </button>
          </div>
        )}
      </div>

      {/* Render the Booking Modal when open */}
      {isModalOpen && (
        <BookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          service={selectedService}
          category={categoryData.title || categoryData.name || category}
        />
      )}

    </div>
  );
};

export default CategoryPage;