import React from 'react';

const ServiceCard = ({ service, onSelect }) => {
  return (
    <div className="saas-card group flex flex-col overflow-hidden cursor-pointer" onClick={() => onSelect(service)}>
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          // Fallback image just in case
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100">
          ₹{service.price}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
        <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {service.duration} min
          </span>
          <span className="text-sm font-semibold text-[#D4AF37] flex items-center gap-1">
            Book Now &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;