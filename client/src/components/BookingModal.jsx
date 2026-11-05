import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const BookingModal = ({ isOpen, onClose, service, category }) => {
  const [selectedGroomer, setSelectedGroomer] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date || !selectedGroomer) return;
      
      const url = `${API_BASE}/bookings/slots?date=${date}&groomer=${selectedGroomer}`;
      console.log("Fetching slots from:", url);

      try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (res.ok) {
          setSlots(data.slots || []);
        } else {
          toast.error(data.message || 'Failed to load slots');
          setSlots([]);
        }
      } catch (error) {
        console.error("Slots Error:", error);
        toast.error('Cannot connect to server to load slots');
        setSlots([]);
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
          service,
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
      <div className="bg-[#151515] border border-gray-800 rounded-3xl w-full max-w-xl p-6 md:p-8 relative my-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Book {service}</h2>

        <form onSubmit={handleBooking} className="space-y-6">
          
          {/* 1. Choose Groomer */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">1. Choose Groomer</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setSelectedGroomer('Mohd Umar')} className={`p-3 rounded-xl border ${selectedGroomer === 'Mohd Umar' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800'}`}>Mohd Umar</button>
              <button type="button" onClick={() => setSelectedGroomer('Mohd Arish')} className={`p-3 rounded-xl border ${selectedGroomer === 'Mohd Arish' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800'}`}>Mohd Arish</button>
            </div>
          </div>

          {/* 2. Date & Time */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">2. Date & Time</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] mb-4"
            />
            
            {date && selectedGroomer && (
              <div className="grid grid-cols-3 gap-2">
                {slots.length > 0 ? slots.map((slot, idx) => (
                  <button 
                    key={idx} 
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-lg text-sm border ${selectedSlot === slot ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#0a0a0a] text-gray-300 border-gray-800'}`}
                  >
                    {slot}
                  </button>
                )) : <p className="text-red-400 text-sm col-span-3">No slots available. Try another date.</p>}
              </div>
            )}
          </div>

          {/* 3. Your Details */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">3. Your Details</label>
            <input 
              type="text" 
              placeholder="Full Name *" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <input 
              type="email" 
              placeholder="Email Address (Optional)" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <input 
              type="tel" 
              placeholder="Phone Number *" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="w-1/3 bg-transparent border border-gray-600 text-white rounded-lg py-3 font-bold hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="w-2/3 btn-gold py-3 rounded-lg font-bold disabled:opacity-50">
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;