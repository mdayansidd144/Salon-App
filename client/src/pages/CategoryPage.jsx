import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { salonData } from '../data/salonData'; // Make sure this path is correct

const CategoryPage = () => {
  const { category } = useParams(); // Gets "haircut" from the URL
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    // Find the specific category from your data file
    // Assuming your salonData looks like: [{ id: 'haircut', title: 'Haircut', services: [...] }]
    const foundCategory = salonData.find(
      (c) => c.id.toLowerCase() === category.toLowerCase()
    );
    setCategoryData(foundCategory);
  }, [category]);

  if (!categoryData) {
    return (
      <div className="pt-32 text-center text-white min-h-screen">
        <h1 className="text-2xl">Category not found</h1>
        <Link to="/" className="text-[#D4AF37] mt-4 inline-block hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {categoryData.title}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {categoryData.description || "Choose from our premium selection of services."}
        </p>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* If your data has a services array, map through it */}
        {categoryData.services?.map((service, index) => (
          <div key={index} className="bg-[#151515] border border-gray-800 rounded-2xl p-6 hover:border-[#D4AF37] transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[#D4AF37] font-bold text-lg">${service.price}</span>
              <button className="btn-gold px-4 py-2 text-sm">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;