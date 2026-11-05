import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BookingModal from '../components/BookingModal'; // Import your modal

// 1. ADD THIS LINE AT THE TOP
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CategoryPage = () => {
  const { category } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // (Keep your existing logic for services and opening the modal)

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
      {/* Your existing UI for categories/services */}
      
      {/* When a user clicks a service, open the modal */}
      <button 
        onClick={() => {
          setSelectedService("Haircut"); // Example
          setIsModalOpen(true);
        }}
        className="btn-gold"
      >
        Book Now
      </button>

      {/* Render the Modal */}
      {isModalOpen && (
        <BookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          service={selectedService}
          category={category}
        />
      )}
    </div>
  );
};

export default CategoryPage;