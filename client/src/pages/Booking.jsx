import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Booking = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  // Fetch services on load
  useEffect(() => {
    fetchServices();
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  }, []);

  // Fetch available slots when service or date changes
  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error('Cannot connect to backend');
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedService) return;
    
    setLoadingSlots(true);
    try {
      const url = `http://localhost:5000/api/appointments/available-slots/${selectedDate}?serviceId=${selectedService.id}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.data || []);
        if (data.data?.length === 0) {
          toast.info('No slots available for this date');
        }
      }
    } catch (error) {
      console.error('Failed to load slots:', error);
      toast.error('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    console.log('=== Booking Attempt ===');
    console.log('Selected Service:', selectedService);
    console.log('Selected Date:', selectedDate);
    console.log('Selected Slot:', selectedSlot);
    console.log('Customer Name:', customerName);
    console.log('Customer Email:', customerEmail);
    console.log('Customer Phone:', customerPhone);
    
    // Validation
    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }
    
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    
    if (!customerName || customerName.trim() === '') {
      toast.error('Please enter your full name');
      return;
    }
    
    if (!customerEmail || customerEmail.trim() === '') {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!customerPhone || customerPhone.trim() === '') {
      toast.error('Please enter your phone number');
      return;
    }

    setBookingLoading(true);
    
    try {
      // Create the data object exactly as backend expects
      const appointmentData = {
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          notes: customerNotes || ''
        },
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedSlot,
        notes: customerNotes || ''
      };
      
      console.log('Sending to backend:', JSON.stringify(appointmentData, null, 2));
      
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();
      console.log('Backend response:', data);
      
      if (data.success) {
        setAppointmentId(data.data.id);
        setShowPayment(true);
        toast.success('Appointment created! Please complete payment.');
      } else {
        toast.error(data.message || 'Booking failed');
        if (data.message && data.message.includes('already booked')) {
          fetchAvailableSlots();
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment: ' + error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedService.price,
          appointmentId: appointmentId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Payment successful! Appointment confirmed.');
        setShowPayment(false);
        // Reset form
        setSelectedService(null);
        setSelectedSlot(null);
        setAvailableSlots([]);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerNotes('');
        fetchAvailableSlots();
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed: ' + error.message);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Appointment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Services */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Select Service</h2>
          <div className="space-y-3">
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setSelectedSlot(null);
                  setAvailableSlots([]);
                }}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedService?.id === service.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.duration} minutes</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">₹{service.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Date & Time */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Date
            </label>
            <input
              type="date"
              min={getMinDate()}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
                setAvailableSlots([]);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedDate && (
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(selectedDate)}
              </p>
            )}
          </div>

          {selectedService && selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              
              {loadingSlots ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 mt-2">Loading available slots...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800">No available slots for this date</p>
                  <p className="text-sm text-yellow-600 mt-1">Please select another date</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-lg text-center transition ${
                          selectedSlot === slot
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-green-600">
                    ✅ {availableSlots.length} slots available
                  </div>
                </>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                <p>⏰ Business Hours: 9:00 AM - 7:00 PM</p>
                <p>🍽️ Lunch Break: 1:00 PM - 2:00 PM</p>
                <p>⏱️ Slot duration: {selectedService?.duration || 30} minutes</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Customer Form */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Your Details</h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address *"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <textarea
              placeholder="Special Requests (Optional)"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
            />
            
            {selectedService && selectedSlot && selectedDate && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800 font-medium">Booking Summary:</p>
                <p className="text-sm text-green-800">Service: {selectedService.name}</p>
                <p className="text-sm text-green-800">Date: {formatDate(selectedDate)}</p>
                <p className="text-sm text-green-800">Time: {selectedSlot}</p>
                <p className="text-lg font-bold text-green-800 mt-2">Total: ₹{selectedService.price}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={bookingLoading || !selectedService || !selectedSlot}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {bookingLoading ? 'Booking...' : `Book Now - ₹${selectedService?.price || 0}`}
            </button>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <button onClick={() => setShowPayment(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600">Service: {selectedService.name}</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">₹{selectedService.price}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800 mb-2">Pay with any UPI app:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-white rounded-full text-sm">Google Pay</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm">PhonePe</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm">Paytm</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm">BHIM</span>
              </div>
            </div>
            
            <button onClick={handlePayment} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
              Pay ₹{selectedService.price} via UPI
            </button>
            
            <button onClick={() => setShowPayment(false)} className="w-full mt-3 text-gray-500 py-2 hover:text-gray-700">
              Cancel
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              Secure payment powered by Razorpay. Supports all UPI apps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;