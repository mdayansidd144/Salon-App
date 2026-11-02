import React, { useState, useEffect } from 'react';
import { getServices } from '../services/api';
import ServiceCard from './ServiceCard';
import BookingModal from './BookingModal';
import toast from 'react-hot-toast';

const ServiceGrid = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('haircut');
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getServices();
        const arr = Object.keys(data.data).map(key => ({ id: key, ...data.data[key] }));
        setCategories(arr);
      } catch {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="py-32 flex justify-center">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
    </div>
  );

  const current = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Services</h2>
            <p className="text-gray-500">
              Select a category to explore our curated grooming packages designed for the modern man.
            </p>
          </div>
          
          {/* SaaS Style Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl overflow-x-auto w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                {cat.title.replace(/[^a-zA-Z ]/g, "")}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {current?.services?.map(service => (
            <ServiceCard key={service.id} service={service} onSelect={setSelectedService} />
          ))}
        </div>
      </div>

      {selectedService && (
        <BookingModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </section>
  );
};

export default ServiceGrid;