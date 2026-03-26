import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// ============ SERVICES DATA WITH PREMIUM IMAGES ============
const servicesData = {
  haircut: {
    title: "✂️ Haircut Styles",
    icon: "✂️",
    description: "Professional haircuts tailored to your style",
    services: [
      {
        id: 'hair_1',
        name: 'Classic Cut',
        price: 1,
        duration: 30,
        description: 'Timeless, clean cut for any occasion',
        image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500',
        popular: true,
        badge: 'Most Popular'
      },
      {
        id: 'hair_2',
        name: 'Fade Cut',
        price: 349,
        duration: 35,
        description: 'Smooth transition from short to long',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500',
        popular: true,
        badge: 'Trending'
      },
      {
        id: 'hair_3',
        name: 'Undercut',
        price: 399,
        duration: 40,
        description: 'Bold style with shaved sides',
        image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'hair_4',
        name: 'Pompadour',
        price: 449,
        duration: 45,
        description: 'Classic voluminous style',
        image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500',
        popular: true,
        badge: 'Premium'
      },
      {
        id: 'hair_5',
        name: 'French Crop',
        price: 379,
        duration: 35,
        description: 'Short textured style',
        image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'hair_6',
        name: 'Buzz Cut',
        price: 249,
        duration: 20,
        description: 'Low maintenance, sharp look',
        image: 'https://images.unsplash.com/photo-1503951914875-3fe63c2d3e2f?w=500',
        popular: false,
        badge: null
      }
    ]
  },
  beard: {
    title: "🧔 Beard Grooming",
    icon: "🧔",
    description: "Expert beard shaping and styling",
    services: [
      {
        id: 'beard_1',
        name: 'Standard Trim',
        price: 149,
        duration: 20,
        description: 'Neat and clean beard shaping',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500',
        popular: true,
        badge: 'Popular'
      },
      {
        id: 'beard_2',
        name: 'Full Beard Styling',
        price: 199,
        duration: 30,
        description: 'Complete beard makeover',
        image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500',
        popular: true,
        badge: 'Best Seller'
      },
      {
        id: 'beard_3',
        name: 'Goatee Style',
        price: 179,
        duration: 25,
        description: 'Stylish goatee shaping',
        image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'beard_4',
        name: 'Moustache Styling',
        price: 129,
        duration: 15,
        description: 'Perfect moustache shaping',
        image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'beard_5',
        name: 'Premium Shave',
        price: 249,
        duration: 35,
        description: 'Luxury hot towel shave',
        image: 'https://images.unsplash.com/photo-1503951914875-3fe63c2d3e2f?w=500',
        popular: true,
        badge: 'Luxury'
      }
    ]
  },
  spa: {
    title: "💆 Hair Spa",
    icon: "💆",
    description: "Rejuvenating hair treatments",
    services: [
      {
        id: 'spa_1',
        name: 'Basic Hair Spa',
        price: 599,
        duration: 60,
        description: 'Essential hair nourishment',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
        popular: true,
        badge: 'Most Popular'
      },
      {
        id: 'spa_2',
        name: 'Deep Conditioning',
        price: 749,
        duration: 75,
        description: 'Intensive moisture treatment',
        image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'spa_3',
        name: 'Hair Mask Treatment',
        price: 799,
        duration: 80,
        description: 'Repair damaged hair',
        image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500',
        popular: true,
        badge: 'Recommended'
      },
      {
        id: 'spa_4',
        name: 'Scalp Therapy',
        price: 849,
        duration: 85,
        description: 'Healthy scalp treatment',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'spa_5',
        name: 'Premium Keratin',
        price: 1099,
        duration: 90,
        description: 'Smooth, frizz-free hair',
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500',
        popular: true,
        badge: 'Premium'
      }
    ]
  },
  facial: {
    title: "✨ Facial Treatments",
    icon: "✨",
    description: "Glowing skin treatments",
    services: [
      {
        id: 'facial_1',
        name: 'Basic Cleanup',
        price: 399,
        duration: 45,
        description: 'Deep cleansing and glow',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
        popular: true,
        badge: 'Essential'
      },
      {
        id: 'facial_2',
        name: 'Gold Facial',
        price: 599,
        duration: 60,
        description: 'Luxury gold therapy',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500',
        popular: true,
        badge: 'Premium'
      },
      {
        id: 'facial_3',
        name: 'Fruit Facial',
        price: 649,
        duration: 60,
        description: 'Natural fruit extracts',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'facial_4',
        name: 'Charcoal Facial',
        price: 699,
        duration: 65,
        description: 'Deep pore cleansing',
        image: 'https://images.unsplash.com/photo-1519415943484-9fa187b6d1cd?w=500',
        popular: true,
        badge: 'Best for Acne'
      },
      {
        id: 'facial_5',
        name: 'Premium O3 Facial',
        price: 899,
        duration: 70,
        description: 'Oxygen infusion therapy',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500',
        popular: false,
        badge: null
      }
    ]
  },
  grooming: {
    title: "🎯 Full Grooming",
    icon: "🎯",
    description: "Complete makeover packages",
    services: [
      {
        id: 'groom_1',
        name: 'Standard Grooming',
        price: 999,
        duration: 90,
        description: 'Haircut + Beard + Facial',
        image: 'https://images.unsplash.com/photo-1503951914875-3fe63c2d3e2f?w=500',
        popular: true,
        badge: 'Best Value'
      },
      {
        id: 'groom_2',
        name: 'Premium Grooming',
        price: 1199,
        duration: 110,
        description: 'Haircut + Beard + Spa',
        image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500',
        popular: true,
        badge: 'Popular'
      },
      {
        id: 'groom_3',
        name: 'Luxury Grooming',
        price: 1399,
        duration: 120,
        description: 'Full grooming + Spa',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'groom_4',
        name: 'Royal Package',
        price: 1799,
        duration: 150,
        description: 'Everything + Premium treatments',
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500',
        popular: true,
        badge: 'Royal'
      }
    ]
  },
  bridal: {
    title: "👰 Bride Grooming",
    icon: "👰",
    description: "Special bridal packages",
    services: [
      {
        id: 'bridal_1',
        name: 'Basic Bridal',
        price: 1999,
        duration: 120,
        description: 'Essential bridal grooming',
        image: 'https://images.unsplash.com/photo-1519415943484-9fa187b6d1cd?w=500',
        popular: true,
        badge: 'Essential'
      },
      {
        id: 'bridal_2',
        name: 'Premium Bridal',
        price: 2499,
        duration: 150,
        description: 'Complete bridal makeover',
        image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500',
        popular: true,
        badge: 'Most Popular'
      },
      {
        id: 'bridal_3',
        name: 'Royal Bridal',
        price: 2999,
        duration: 180,
        description: 'Luxury bridal package',
        image: 'https://images.unsplash.com/photo-1585747860714-2ba616e73f2e?w=500',
        popular: true,
        badge: 'Luxury'
      },
      {
        id: 'bridal_4',
        name: 'Celebrity Package',
        price: 3999,
        duration: 210,
        description: 'Red carpet ready',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500',
        popular: false,
        badge: null
      },
      {
        id: 'bridal_5',
        name: 'Full Makeover',
        price: 4999,
        duration: 240,
        description: 'Complete transformation',
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500',
        popular: true,
        badge: 'Ultimate'
      }
    ]
  }
};

// ============ HOME PAGE ============
const Home = () => {
  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      toast.success('✅ Backend is running!');
    } catch (error) {
      toast.error('❌ Backend not running. Start server with: node server.js');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            ✂️ Salon Pro
          </h1>
          <p style={{ fontSize: '20px', color: '#cbd5e1', marginBottom: '32px' }}>
            Premium Grooming | Expert Stylists | Luxury Experience
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book" style={{ backgroundColor: '#f97316', color: 'white', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
              Book Now
            </Link>
            <Link to="/my-bookings" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
              My Bookings
            </Link>
            <button onClick={testBackend} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 32px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              Test Backend
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: '#1e293b' }}>
          Our Premium Services
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {Object.entries(servicesData).map(([key, category]) => (
            <Link 
              key={key}
              to={`/category/${key}`}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={category.services[0]?.image} 
                    alt={category.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{category.icon}</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{category.title}</h3>
                  <p style={{ color: '#64748b', marginBottom: '16px' }}>{category.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f97316', fontWeight: 'bold' }}>{category.services.length}+ Styles</span>
                    <span style={{ color: '#3b82f6' }}>View All →</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ CATEGORY PAGE ============
const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [availableSlots, setAvailableSlots] = React.useState([]);
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [customerName, setCustomerName] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [bookingLoading, setBookingLoading] = React.useState(false);
  const [slotLoading, setSlotLoading] = React.useState(false);
  const [showBookingForm, setShowBookingForm] = React.useState(false);

  const path = window.location.pathname;
  const categoryKey = path.split('/').pop();

  React.useEffect(() => {
    if (categoryKey && servicesData[categoryKey]) {
      setSelectedCategory(servicesData[categoryKey]);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, [categoryKey]);

  React.useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedService) return;
    
    setSlotLoading(true);
    try {
      const url = `http://localhost:5000/api/appointments/available-slots/${selectedDate}?serviceId=${selectedService.id}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setAvailableSlots(data.data || []);
      }
    } catch (error) { 
      console.error('Failed to load slots:', error);
    } finally {
      setSlotLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService) return toast.error('Please select a service');
    if (!selectedSlot) return toast.error('Please select a time slot');
    if (!customerName || !customerEmail || !customerPhone) return toast.error('Please fill all customer details');

    setBookingLoading(true);
    
    try {
      const appointmentResponse = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: customerName.trim(), email: customerEmail.trim(), phone: customerPhone.trim(), notes: '' },
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedSlot,
          notes: '',
          customizations: []
        })
      });
      
      const appointmentData = await appointmentResponse.json();
      
      if (!appointmentData.success) {
        if (appointmentData.message && appointmentData.message.includes('already booked')) {
          toast.error('This time slot is already booked! Please select another time.');
          fetchAvailableSlots();
        } else {
          toast.error(appointmentData.message || 'Booking failed');
        }
        setBookingLoading(false);
        return;
      }
      
      const appointmentId = appointmentData.data.id;
      const totalAmount = selectedService.price;
      
      const orderResponse = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, appointmentId: appointmentId })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        toast.error('Failed to initiate payment');
        setBookingLoading(false);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Salon Pro',
          description: selectedService.name,
          order_id: orderData.orderId,
          handler: async (response) => {
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointmentId
              })
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              toast.success(`✅ Payment successful! Appointment confirmed. Total: ₹${totalAmount}`);
              setSelectedService(null);
              setSelectedSlot(null);
              setCustomerName('');
              setCustomerEmail('');
              setCustomerPhone('');
              setShowBookingForm(false);
            } else {
              toast.error('Payment verification failed');
            }
            setBookingLoading(false);
          },
          prefill: { name: customerName, email: customerEmail, contact: customerPhone },
          theme: { color: '#f97316' },
          modal: { ondismiss: () => {
            setBookingLoading(false);
            toast('Payment cancelled', { icon: '❌' });
          }}
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking: ' + error.message);
      setBookingLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!selectedCategory) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Category Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{selectedCategory.icon}</div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
          {selectedCategory.title}
        </h1>
        <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
          {selectedCategory.description}
        </p>
      </div>

      {/* Services Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', color: '#1e293b' }}>
          Choose Your Style
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {selectedCategory.services.map(service => (
            <motion.div
              key={service.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setSelectedService(service);
                setShowBookingForm(true);
              }}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img 
                  src={service.image} 
                  alt={service.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                {service.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: service.badge === 'Premium' || service.badge === 'Luxury' || service.badge === 'Royal' ? '#f97316' : '#10b981',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {service.badge}
                  </span>
                )}
                {service.popular && !service.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#f97316',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🔥 Popular
                  </span>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
                  {service.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                  {service.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316' }}>₹{service.price}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>/{service.duration} min</span>
                  </div>
                  <span style={{ color: '#f97316', fontWeight: '500' }}>Select →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '85vh',
              overflow: 'auto',
              padding: '32px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Book {selectedService.name}</h2>
              <button
                onClick={() => setShowBookingForm(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <img 
              src={selectedService.image} 
              alt={selectedService.name}
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
            />

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Date</h3>
              <input
                type="date"
                min={getMinDate()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Time</h3>
              {slotLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
              ) : availableSlots.length === 0 ? (
                <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '12px', textAlign: 'center', color: '#92400e' }}>
                  No slots available
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {availableSlots.slice(0, 12).map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '10px',
                        backgroundColor: selectedSlot === slot ? '#f97316' : '#f1f5f9',
                        color: selectedSlot === slot ? 'white' : '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Your Details</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #e2e8f0', borderRadius: '12px' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #e2e8f0', borderRadius: '12px' }}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px' }}
              />
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{selectedService.name}</span>
                <span>₹{selectedService.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <span>Total</span>
                <span style={{ color: '#f97316' }}>₹{selectedService.price}</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading || !selectedSlot}
              style={{
                width: '100%',
                backgroundColor: '#f97316',
                color: 'white',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: bookingLoading || !selectedSlot ? 'not-allowed' : 'pointer',
                opacity: bookingLoading || !selectedSlot ? 0.6 : 1
              }}
            >
              {bookingLoading ? 'Processing...' : `Pay ₹${selectedService.price}`}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ============ MY BOOKINGS PAGE ============
const MyBookings = () => {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [cancelling, setCancelling] = React.useState(null);
  const [cancellationReason, setCancellationReason] = React.useState('');

  React.useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      const data = await response.json();
      setBookings(data.data.filter(b => b.status !== 'cancelled' && b.status !== 'replaced'));
    } catch (error) { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!cancellationReason.trim()) return toast.error('Please provide a reason');
    setCancelling(id);
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}/cancel`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancellationReason })
      });
      const data = await response.json();
      if (data.success) { toast.success('Appointment cancelled. Slot is now available for walk-in.'); fetchBookings(); setCancellationReason(''); }
      else toast.error(data.message);
    } catch (error) { toast.error('Failed to cancel'); }
    finally { setCancelling(null); }
  };

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '';

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>My Bookings</h1>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <p>No bookings found</p>
          <Link to="/" style={{ display: 'inline-block', marginTop: '16px', color: '#f97316' }}>Book an appointment</Link>
        </div>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${booking.status === 'confirmed' ? '#10b981' : '#f59e0b'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{booking.service?.name}</h3>
                {booking.customizations?.length > 0 && <p style={{ fontSize: '12px', color: '#6b7280' }}>✨ {booking.customizations.map(c => c.name).join(', ')}</p>}
                <p>📅 {formatDate(booking.date)} at {booking.startTime}</p>
                <p style={{ color: '#f97316', fontWeight: 'bold' }}>₹{booking.payment?.amount}</p>
                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '12px', backgroundColor: booking.status === 'confirmed' ? '#d1fae5' : '#fef3c7', color: booking.status === 'confirmed' ? '#065f46' : '#92400e' }}>{booking.status || 'pending'}</span>
              </div>
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                cancelling === booking.id ? (
                  <div>
                    <textarea placeholder="Reason for cancellation" value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} style={{ width: '200px', padding: '8px', fontSize: '12px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} rows="2" />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleCancel(booking.id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Confirm</button>
                      <button onClick={() => { setCancelling(null); setCancellationReason(''); }} style={{ padding: '6px 12px', backgroundColor: '#9ca3af', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setCancelling(booking.id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Cancel Booking</button>
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ============ LOGIN PAGE ============
const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) return toast.error('Please enter email and password');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = data.user.role === 'barber' ? '/barber-dashboard' : '/admin';
      } else toast.error(data.message || 'Login failed');
    } catch (error) { toast.error('Cannot connect to backend'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Login</h2>
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
          <p style={{ fontSize: '12px', color: '#9a3412', textAlign: 'center' }}>Admin: admin@salon.com / admin123<br/>Barber: raj@salon.com / barber123</p>
        </div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', backgroundColor: '#f97316', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>{loading ? 'Logging in...' : 'Login'}</button>
      </div>
    </div>
  );
};

// ============ ADMIN DASHBOARD ============
const AdminDashboard = () => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    fetchStats(); fetchAppointments();
  }, []);

  const fetchStats = async () => {
    try { const response = await fetch('http://localhost:5000/api/dashboard/stats'); const data = await response.json(); setStats(data.data); } 
    catch (error) { console.error('Failed to load stats'); } finally { setLoading(false); }
  };

  const fetchAppointments = async () => {
    try { const response = await fetch('http://localhost:5000/api/appointments'); const data = await response.json(); setAppointments(data.data || []); } 
    catch (error) { console.error('Failed to load appointments'); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><h3>Total Bookings</h3><p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316' }}>{stats?.totalBookings || 0}</p></div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><h3>Today's Bookings</h3><p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats?.todayBookings || 0}</p></div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><h3>Total Revenue</h3><p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>₹{stats?.totalRevenue || 0}</p></div>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Recent Appointments</h2>
        {appointments.length === 0 ? <p>No appointments yet</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Customer</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.filter(a => a.status !== 'cancelled').slice(0, 10).map(apt => (
                <tr key={apt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>{apt.customer?.name}</td>
                  <td style={{ padding: '12px' }}>{apt.service?.name}</td>
                  <td style={{ padding: '12px' }}>{apt.date?.split('T')[0]} at {apt.startTime}</td>
                  <td style={{ padding: '12px', color: '#f97316', fontWeight: 'bold' }}>₹{apt.payment?.amount}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '12px', backgroundColor: apt.status === 'confirmed' ? '#d1fae5' : '#fef3c7', color: apt.status === 'confirmed' ? '#065f46' : '#92400e' }}>{apt.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ============ BARBER DASHBOARD ============
const BarberDashboard = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [cancelledSlots, setCancelledSlots] = React.useState([]);
  const [showWalkInForm, setShowWalkInForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedService, setSelectedService] = React.useState(null);
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [selectedCancelledSlot, setSelectedCancelledSlot] = React.useState(null);
  const [services, setServices] = React.useState([]);
  const [walkInCustomer, setWalkInCustomer] = React.useState({ name: '', phone: '', email: '' });

  React.useEffect(() => { fetchAppointments(); fetchCancelledSlots(); fetchServices(); }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/today/priority');
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (error) { console.error('Failed to fetch'); } finally { setLoading(false); }
  };

  const fetchCancelledSlots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/available-walkin-slots');
      const data = await response.json();
      setCancelledSlots(data.data || []);
    } catch (error) { console.error('Failed to fetch cancelled slots'); }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data.data || []);
    } catch (error) { console.error('Failed to fetch services'); }
  };

  const handleWalkInBooking = async () => {
    if (!walkInCustomer.name || !walkInCustomer.phone) return toast.error('Please enter customer name and phone');
    if (!selectedService) return toast.error('Please select a service');
    if (!selectedSlot) return toast.error('Please select a time slot');

    try {
      const response = await fetch('http://localhost:5000/api/appointments/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: walkInCustomer.name, phone: walkInCustomer.phone, email: walkInCustomer.email || 'walkin@salon.com' },
          serviceId: selectedService.id,
          date: selectedCancelledSlot?.date || new Date().toISOString().split('T')[0],
          startTime: selectedSlot,
          notes: `Walk-in customer taking cancelled slot from ${selectedCancelledSlot?.originalCustomer || 'unknown'}`,
          customizations: []
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setShowWalkInForm(false);
        setWalkInCustomer({ name: '', phone: '', email: '' });
        setSelectedService(null);
        setSelectedSlot(null);
        setSelectedCancelledSlot(null);
        fetchAppointments();
        fetchCancelledSlots();
      } else toast.error(data.message);
    } catch (error) { toast.error('Failed to add walk-in'); }
  };

  const handleSelectCancelledSlot = (slot) => {
    setSelectedCancelledSlot(slot);
    setSelectedSlot(slot.time);
    toast.success(`Selected slot: ${slot.time} (previously cancelled by ${slot.originalCustomer})`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Barber Dashboard</h1>
        <button onClick={() => setShowWalkInForm(true)} style={{ backgroundColor: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Add Walk-in Customer</button>
      </div>

      {cancelledSlots.length > 0 && (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#92400e' }}>🕐 Available Slots (Cancelled by Customers)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cancelledSlots.map((slot, idx) => (
              <div key={idx} style={{ backgroundColor: selectedCancelledSlot === slot ? '#fde68a' : 'white', padding: '12px', borderRadius: '8px', border: selectedCancelledSlot === slot ? '2px solid #f59e0b' : '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => handleSelectCancelledSlot(slot)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <p><strong>Slot:</strong> {slot.date} at {slot.time}</p>
                    <p><strong>Original Customer:</strong> {slot.originalCustomer}</p>
                    <p><strong>Service:</strong> {slot.serviceName}</p>
                  </div>
                  <span style={{ padding: '4px 12px', backgroundColor: '#f59e0b', color: 'white', borderRadius: '20px', fontSize: '12px' }}>AVAILABLE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
        <p>📊 <strong>Priority Order:</strong> Walk-in customers are shown first for immediate service</p>
      </div>

      {appointments.map(apt => (
        <div key={apt.id} style={{ backgroundColor: apt.isWalkIn ? '#fef3c7' : 'white', borderRadius: '8px', padding: '16px', marginBottom: '12px', borderLeft: `4px solid ${apt.isWalkIn ? '#f59e0b' : '#f97316'}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '12px', backgroundColor: apt.isWalkIn ? '#fef3c7' : '#dbeafe', color: apt.isWalkIn ? '#92400e' : '#1e40af' }}>{apt.isWalkIn ? '🚶 Walk-in' : '📱 Online'}</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{apt.startTime}</span>
                {apt.isOverride && <span style={{ padding: '2px 8px', backgroundColor: '#fde68a', borderRadius: '20px', fontSize: '10px', color: '#92400e' }}>Override</span>}
              </div>
              <p style={{ fontWeight: 'bold' }}>{apt.customer?.name}</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{apt.service?.name}</p>
            </div>
          </div>
        </div>
      ))}

      {cancelledSlots.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <p>No cancelled slots available. Walk-in customers can only book when a customer cancels.</p>
        </div>
      )}

      {showWalkInForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Add Walk-in Customer</h2>
            
            {cancelledSlots.length === 0 ? (
              <div style={{ backgroundColor: '#fee2e2', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <p style={{ color: '#dc2626' }}>⚠️ No cancelled slots available</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '16px', backgroundColor: '#fef3c7', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Select a cancelled slot:</p>
                  {cancelledSlots.map((slot, idx) => (
                    <div key={idx} onClick={() => { setSelectedCancelledSlot(slot); setSelectedSlot(slot.time); }} style={{ padding: '8px', marginBottom: '8px', backgroundColor: selectedCancelledSlot === slot ? '#fde68a' : '#fff', borderRadius: '6px', cursor: 'pointer', border: selectedCancelledSlot === slot ? '1px solid #f59e0b' : '1px solid #e5e7eb' }}>
                      <p><strong>{slot.time}</strong> - {slot.serviceName}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>Cancelled by: {slot.originalCustomer}</p>
                    </div>
                  ))}
                </div>
                
                <input type="text" placeholder="Customer Name *" value={walkInCustomer.name} onChange={(e) => setWalkInCustomer({...walkInCustomer, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                <input type="tel" placeholder="Phone Number *" value={walkInCustomer.phone} onChange={(e) => setWalkInCustomer({...walkInCustomer, phone: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                
                <select value={selectedService?.id || ''} onChange={(e) => setSelectedService(services.find(s => s.id === e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                  <option value="">Select Service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} - ₹{s.basePrice}</option>)}
                </select>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button onClick={handleWalkInBooking} disabled={!selectedCancelledSlot || !selectedService || !walkInCustomer.name} style={{ flex: 1, backgroundColor: '#f97316', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: (!selectedCancelledSlot || !selectedService || !walkInCustomer.name) ? 'not-allowed' : 'pointer', opacity: (!selectedCancelledSlot || !selectedService || !walkInCustomer.name) ? 0.6 : 1 }}>Add Walk-in</button>
                  <button onClick={() => { setShowWalkInForm(false); }} style={{ flex: 1, backgroundColor: '#9ca3af', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============ NAVBAR ============
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (user) setUserRole(JSON.parse(user).role);
  }, []);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setIsLoggedIn(false); toast.success('Logged out'); window.location.href = '/'; };

  return (
    <nav style={{ backgroundColor: '#1e293b', color: 'white', padding: '16px 32px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Link to="/" style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>✂️ Salon Pro</Link>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', hover: { color: 'white' } }}>Home</Link>
          <Link to="/my-bookings" style={{ color: '#cbd5e1', textDecoration: 'none' }}>My Bookings</Link>
          {isLoggedIn ? (
            <>
              {userRole === 'barber' ? <Link to="/barber-dashboard" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Barber Dashboard</Link> : <Link to="/admin" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Admin</Link>}
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// ============ APP ============
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/barber-dashboard" element={<BarberDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;