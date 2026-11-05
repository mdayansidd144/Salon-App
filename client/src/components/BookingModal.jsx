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

  const stylists = salonData?.stylists || [];

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchSlots = async () => {
      if (!date || !selectedGroomer) {
        setSlots([]);
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE}/bookings/slots?date=${date}&groomer=${selectedGroomer}`);
        const data = await res.json();
        
        if (res.ok && data.slots && data.slots.length > 0) {
          setSlots(data.slots.map(formatTime));
        } else {
          const defaultSlots = [];
          for (let h = 10; h <= 21; h++) {
            defaultSlots.push(`${h.toString().padStart(2, '0')}:00`);
            defaultSlots.push(`${h.toString().padStart(2, '0')}:30`);
          }
          setSlots(defaultSlots.map(formatTime));
        }
      } catch (error) {
        console.error("API Error loading slots:", error);
        const defaultSlots = [];
        for (let h = 10; h <= 21; h++) {
          defaultSlots.push(`${h.toString().padStart(2, '0')}:00`);
          defaultSlots.push(`${h.toString().padStart(2, '0')}:30`);
        }
        setSlots(defaultSlots.map(formatTime));
      }
    };
    fetchSlots();
  }, [date, selectedGroomer, isOpen]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedGroomer || !date || !selectedSlot || !name || !phone) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email, phone },
          serviceId: serviceData?.name || 'Service',
          barberId: selectedGroomer,
          date: date,
          startTime: selectedSlot,
          endTime: selectedSlot,
          amount: serviceData?.price || 0
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Booking Confirmed!');
        onClose(); 
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Server timed out. Please try again.');
      } else {
        toast.error('Cannot connect to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !serviceData) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111111] border border-gray-800 rounded-2xl w-full max-w-lg relative my-auto shadow-2xl">
        <div className="flex items-center p-6 border-b border-gray-800 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          {serviceData.image && (
            <img src={serviceData.image} alt={serviceData.name} className="w-16 h-16 object-cover rounded-xl border border-gray-700 mr-4" />
          )}
          <div>
            <h2 className="text-2xl font-serif text-white">{serviceData.name}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {serviceData.duration || '30 mins'} • <span className="text-[#D4AF37] font-medium">₹{serviceData.price}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">1. Choose Groomer</label>
            <div className="flex gap-4">
              {stylists.map((stylist) => (
                <button 
                  key={stylist.id}
                  type="button" 
                  onClick={() => setSelectedGroomer(stylist.name)} 
                  className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${selectedGroomer === stylist.name ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-800 hover:border-gray-600 bg-[#1a1a1a]'}`}
                >
                  <img src={stylist.image} alt={stylist.name} className="w-16 h-16 rounded-full object-cover object-top mb-3 border border-gray-700" />
                  <span className="text-white text-sm font-medium">{stylist.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{stylist.role}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">2. Date & Time</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors [color-scheme:dark]" />
            <div className="mt-4">
              {date && selectedGroomer ? (
                slots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                    {slots.map((slot, idx) => (
                      <button key={idx} type="button" onClick={() => setSelectedSlot(slot)} className={`py-2 rounded-lg text-xs border transition-all ${selectedSlot === slot ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold' : 'bg-[#1a1a1a] text-gray-300 border-gray-800 hover:border-gray-600'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-2">No slots available.</p>
                )
              ) : (
                <p className="text-gray-500 text-sm text-center py-2">Select a groomer to see times.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">3. Your Details</label>
            <input type="text" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
            <input type="email" placeholder="Email Address (Optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
            <input type="tel" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
          </div>

          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="w-1/3 bg-transparent border border-gray-700 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="w-2/3 bg-[#D4AF37] text-black rounded-lg py-3 font-bold hover:bg-[#b8952b] transition disabled:opacity-50">
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;