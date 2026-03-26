import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">✂️ Salon Pro</h1>
        <p className="text-xl text-gray-600">Professional Grooming at Your Fingertips</p>
        <Link to="/book" className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">Book Now</Link>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {services.slice(0, 3).map(service => (
          <div key={service._id} className="border rounded-lg p-6 text-center shadow">
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-2">{service.duration} min</p>
            <p className="text-2xl font-bold text-blue-600">₹{service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;