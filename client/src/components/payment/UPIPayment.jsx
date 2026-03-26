import React, { useState } from 'react';
import toast from 'react-hot-toast';
const UPIPayment = ({ amount, appointmentId, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  // ============ STEP 1: CREATE ORDER ============
  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Call backend to create Razorpay order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amount, 
          appointmentId: appointmentId 
        })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      // ============ STEP 2: LOAD RAZORPAY ============
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
      script.onload = () => {
        // Configure Razorpay options
        const options = {
          key: orderData.keyId,                    // Your Razorpay Key ID
          amount: orderData.amount,                // Amount in paise
          currency: orderData.currency,            // INR
          name: 'Salon Pro',                       // Business name
          description: 'Appointment Booking',       // Description
          order_id: orderData.orderId,              // Order ID from backend
          
          // ============ STEP 3: HANDLE PAYMENT SUCCESS ============
          handler: async (response) => {
            // Customer has paid! Now verify with backend
            const verifyResponse = await fetch('/api/payments/verify', {
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
              toast.success('Payment successful! Appointment confirmed.');
              onSuccess(); // Call parent success callback
            } else {
              toast.error('Payment verification failed');
            }
          },
          
          // Customer details (pre-fill form)
          prefill: {
            name: 'Customer Name',
            email: 'customer@email.com',
            contact: '9999999999'
          },
          
          // Theme customization
          theme: {
            color: '#3B82F6'  // Blue color
          },
          
          // Handle modal close
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.info('Payment cancelled');
            }
          }
        };
        
        // ============ STEP 4: OPEN PAYMENT MODAL ============
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      toast.error('Failed to initialize payment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Pay ₹{amount}</h2>
        
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? 'Processing...' : `Pay ₹${amount} with UPI`}
        </button>
        
        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-600 py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UPIPayment;