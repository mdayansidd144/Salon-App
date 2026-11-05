import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { salonData } from '../data/salonData';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const BookingModal = ({ isOpen, onClose, serviceData, category }) => {
  const [selectedGroomer, setSelectedGroomer] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const stylists = salonData.stylists || [];

  // Helper function to generate slots from 10 AM to 10 PM
  const generateTimeSlots = () => {
    const times = [];
    let hour = 10;
    let minute = 0;
    
    while (hour < 22) { // 22 is 10 PM
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      const displayMinute = minute === 0 ? '00' : '30';
      
      times.push(`${displayHour}:${displayMinute} ${ampm}`);
      
      if (minute === 0) {
        minute = 30;
      } else {
        minute = 0;
        hour++;
      }
    }
    return times;
  };

  useEffect(() => {
    const fetchSlots = async () => {
      // Don't fetch if no date or groomer is selected
      if (!date || !selectedGroomer) {
        setSlots([]);
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE}/bookings/slots?date=${date}&groomer=${selectedGroomer}`);
        const data = await res.json();
        
        // If the backend returns slots, use them
        if (res.ok && data.slots && data.slots.length > 0) {
          setSlots(data.slots);
        } else {
          // FALLBACK: If backend returns empty or fails, show 10 AM - 10 PM slots
          setSlots(generateTimeSlots());
        }
      } catch (error) {
        console.error("Failed to fetch slots, using default times:", error);
        // FALLBACK: If server is down, still show the standard slots
        setSlots(generateTimeSlots());
      }
    };
    
    fetchSlots();
  }, [date, selectedGroomer]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedGroomer || !date || !selectedSlot || !name || !phone) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceData.name,
          price: serviceData.price,
          category,
          groomer: selectedGroomer,
          date,
          time: selectedSlot,
          name,
          email,
          phone
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Booking Confirmed!');
        onClose();
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (error) {
      toast.error('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-gray-800 rounded-2xl w-full max-w-lg relative my-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-800 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          {serviceData.image && (
            <img 
              src={serviceData.image} 
              alt={serviceData.name} 
              className="w-16 h-16 object-cover rounded-xl border border-gray-700 mr-4" 
            />
          )}
          <div>
            <h2 className="text-2xl font-serif text-white">{serviceData.name}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {serviceData.duration || '15 mins'} • <span className="text-[#D4AF37] font-medium">₹{serviceData.price}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="p-6 space-y-6">
          
          {/* 1. Choose Groomer */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">1. Choose Groomer</label>
            <div className="flex gap-4">
              {stylists.map((stylist) => (
                <button 
                  key={stylist.id}
                  type="button" 
                  onClick={() => setSelectedGroomer(stylist.name)} 
                  className={`flex-1 flex flex-col items-center p-3 rounded-xl border transition-all ${selectedGroomer === stylist.name ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-800 hover:border-gray-600'}`}
                >
                  <img src={stylist.image} alt={stylist.name} className="w-12 h-12 rounded-full object-cover mb-2 border border-gray-700" />
                  <span className="text-white text-sm font-medium">{stylist.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{stylist.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Date & Time */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">2. Date & Time</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors [color-scheme:dark]"
            />
            
            {/* SLOTS GRID */}
            <div className="mt-4">
              {date && selectedGroomer ? (
                slots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {slots.map((slot, idx) => (
                      <button 
                        key={idx} 
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded-lg text-sm border transition-all ${selectedSlot === slot ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold' : 'bg-[#1a1a1a] text-gray-300 border-gray-800 hover:border-gray-600'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No slots available.</p>
                )
              ) : (
                <p className="text-gray-500 text-sm">Select a groomer to see times.</p>
              )}
            </div>
          </div>

          {/* 3. Your Details */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">3. Your Details</label>
            <input 
              type="text" 
              placeholder="Full Name *" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
            />
            <input 
              type="email" 
              placeholder="Email Address (Optional)" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
            />
            <input 
              type="tel" 
              placeholder="Phone Number *" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="w-1/3 bg-transparent border border-gray-700 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="w-2/3 bg-[#D4AF37] text-black rounded-lg py-3 font-bold hover:bg-[#b8952b] transition disabled:opacity-50">
              {/* CHANGED BUTTON TEXT HERE */}
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;