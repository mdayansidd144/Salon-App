import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { salonData } from '../data/salonData';

const API_BASE = 'http://localhost:5000';

const BookingModal = ({ service, onClose }) => {
  const [selectedGroomer, setSelectedGroomer] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);

  const groomers = salonData.stylists;

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hour, minute] = time24.split(':');
    let h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minute} ${ampm}`;
  };

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedGroomer && selectedDate && service) {
      setSlotLoading(true);
      fetch(`${API_BASE}/api/appointments/available-slots/${selectedDate}?serviceId=${service.id}&barberId=${selectedGroomer.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setAvailableSlots(data.data || []);
          else setAvailableSlots([]);
        })
        .catch(() => toast.error('Failed to load slots'))
        .finally(() => setSlotLoading(false));
    }
  }, [selectedGroomer, selectedDate, service]);

  const handleBooking = async () => {
    if (!selectedGroomer || !selectedSlot) return toast.error('Please select a groomer and time');
    if (!customer.name || !customer.phone) return toast.error('Please fill Name and Phone number');

    setLoading(true);
    try {
      const [startHour, startMinute] = selectedSlot.split(':');
      const startMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
      const endMinutes = startMinutes + service.duration;
      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

      const finalEmail = customer.email.trim() === '' ? 'guest@cutforyou.com' : customer.email;

      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { ...customer, email: finalEmail },
          serviceId: service.id,
          barberId: selectedGroomer.id,
          date: selectedDate,
          startTime: selectedSlot,
          endTime: endTime,
          amount: service.price
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Booking Confirmed! An email has been sent to the groomers.');
        onClose();
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (error) {
      toast.error('Booking process failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#151515] border border-gray-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl my-8">

        <button onClick={onClose} className="absolute top-4 right-6 text-gray-400 hover:text-white text-3xl font-light z-10">&times;</button>

        <div className="mb-6 border-b border-gray-800 pb-4 flex gap-4 items-center">
          <img src={service.image} alt={service.name} className="w-16 h-16 rounded-xl object-cover border border-white/20" />
          <div>
            <h2 className="text-2xl font-bold text-white">{service.name}</h2>
            <p className="text-sm text-gray-400 font-medium">{service.duration} mins &bull; <span className="text-[#D4AF37] font-bold">₹{service.price}</span></p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">1. Choose Groomer</label>
            <div className="grid grid-cols-2 gap-3">
              {groomers.map(g => (
                <div key={g.id} onClick={() => setSelectedGroomer(g)}
                  className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${selectedGroomer?.id === g.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800 hover:border-gray-600'}`}>
                  <img src={g.image} alt={g.name} className="w-14 h-14 rounded-full object-cover object-top mx-auto mb-2 border-2 border-white/20 shadow-lg" />
                  <p className="text-sm font-bold text-white">{g.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{g.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">2. Date & Time</label>
            <input
              type="date"
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] mb-3"
            />

            {selectedGroomer ? (
              slotLoading ? <p className="text-sm text-gray-500">Checking slots...</p> :
              availableSlots.length === 0 ? <p className="text-sm text-red-400">No slots available. Try another date.</p> : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      className={`py-2 text-xs font-bold rounded-lg transition ${selectedSlot === slot ? 'bg-[#D4AF37] text-black' : 'bg-[#0a0a0a] text-gray-300 border border-gray-800 hover:border-gray-600'}`}>
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              )
            ) : <p className="text-sm text-gray-500">Select a groomer to see times.</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">3. Your Details</label>
            <input type="text" placeholder="Full Name *" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] placeholder-gray-600" />
            <input type="email" placeholder="Email Address (Optional)" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] placeholder-gray-600" />
            <input type="tel" placeholder="Phone Number *" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] placeholder-gray-600" />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="w-1/3 py-3 rounded-lg font-bold text-gray-400 border border-gray-700 hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={loading || !selectedGroomer || !selectedSlot}
              className="w-2/3 btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;