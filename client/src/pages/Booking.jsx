import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Calendar from 'react-calendar';
import RazorpayPayment from '../components/payment/RazorpayPayment';
import ServiceSelector from '../components/booking/ServiceSelector';
import DateTimePicker from '../components/booking/DateTimePicker';
import CustomerForm from '../components/booking/CustomerForm';
import BookingSummary from '../components/booking/BookingSummary';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required').min(10, 'Invalid phone number'),
  notes: yup.string()
});

const Booking = () => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data.data);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(`/api/appointments/available-slots/${selectedDate.toISOString().split('T')[0]}`);
      setAvailableSlots(response.data.data);
    } catch (error) {
      toast.error('Failed to load available slots');
    }
  };

  const onSubmit = async (data) => {
    if (!selectedService || !selectedSlot) {
      toast.error('Please select a service and time slot');
      return;
    }

    setLoading(true);
    
    try {
      const appointmentData = {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes
        },
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: selectedSlot,
        amount: selectedService.price
      };

      const response = await axios.post('/api/appointments', appointmentData);
      const appointment = response.data.data;
      
      setAppointmentId(appointment._id);
      setBookingData(appointment);
      
      // Show payment modal if amount > 0
      if (selectedService.price > 0) {
        setShowPayment(true);
      } else {
        toast.success('Appointment booked successfully!');
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedSlot(null);
    setBookingData(null);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast.success('Payment successful! Appointment confirmed.');
    resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Your Appointment</h1>

      {/* Steps Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {num}
              </div>
              {num < 3 && <div className={`w-16 h-1 ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <div className="w-32 text-center text-sm">Select Service</div>
          <div className="w-32 text-center text-sm">Choose Time</div>
          <div className="w-32 text-center text-sm">Your Details</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <ServiceSelector
                services={services}
                selected={selectedService}
                onSelect={(service) => {
                  setSelectedService(service);
                  setStep(2);
                }}
              />
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <DateTimePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {/* Step 3: Customer Details */}
            {step === 3 && (
              <CustomerForm
                register={register}
                errors={errors}
                onBack={() => setStep(2)}
                loading={loading}
              />
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <BookingSummary
              service={selectedService}
              date={selectedDate}
              time={selectedSlot}
              onBack={step === 3 ? () => setStep(2) : null}
            />
          </div>
        </div>
      </form>

      {/* Payment Modal */}
      {showPayment && appointmentId && selectedService && (
        <RazorpayPayment
          appointmentId={appointmentId}
          amount={selectedService.price}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default Booking;