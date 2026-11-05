import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { salonData } from '../data/salonData'; // Make sure this path is correct

const CategoryPage = () => {
  const { category } = useParams(); 
  const [categoryData, setCategoryData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      // Find the category safely
      // Note: We check if salonData is an array first
      if (Array.isArray(salonData)) {
        const foundCategory = salonData.find(
          (c) => c.id?.toLowerCase() === category?.toLowerCase() || c.title?.toLowerCase() === category?.toLowerCase()
        );
        setCategoryData(foundCategory || null);
      } else {
        // If salonData is formatted as an object instead of an array
        const foundCategory = salonData[category];
        setCategoryData(foundCategory || null);
      }
    } catch (err) {
      console.error("Error loading category:", err);
      setError(true);
    }
  }, [category]);

  if (error) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-screen">
        <h1 className="text-3xl text-white">Something went wrong loading this page.</h1>
        <Link to="/" className="btn-gold mt-6 inline-block">Go Back Home</Link>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-6 text-center min-h-screen">
        <h1 className="text-3xl text-white mb-4">Category "{category}" not found</h1>
        <p className="text-gray-400 mb-8">The data for this category might not be set up in salonData.js yet.</p>
        <Link to="/" className="btn-gold inline-block">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          {categoryData.title || categoryData.name || category}
        </h1>
        <p className="text-gray-400">
          {categoryData.description || "Select a service below to book an appointment."}
        </p>
      </div>

      {/* Render Services safely */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.services && Array.isArray(categoryData.services) ? (
          categoryData.services.map((service, index) => (
            <div key={index} className="bg-[#151515] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">{service.name || service}</h3>
              {service.price && <p className="text-[#D4AF37] font-bold mb-4">${service.price}</p>}
              <button className="btn-gold w-full py-2">Book Now</button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No services found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;