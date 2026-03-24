import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UpiPayment } from './UPIPayment';

const RazorpayPayment = ({ appointmentId, amount, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      // Create order
      const response = await axios.post('/api/payments/razorpay/initiate', {
        appointmentId
      });

      const { orderId, amount: orderAmount, keyId } = response.data.data;

      const options = {
        key: keyId,
        amount: orderAmount,
        currency: 'INR',
        name: 'Salon Pro',
        description: 'Appointment Booking',
        order_id: orderId,
        handler: async (response) => {
          // Verify payment
          const verifyResponse = await axios.post('/api/payments/razorpay/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            appointmentId
          });

          if (verifyResponse.data.success) {
            toast.success('Payment successful!');
            onSuccess();
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Pay with UPI</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-600">Amount to pay:</p>
          <p className="text-3xl font-bold text-blue-600">₹{amount}</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with UPI'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <UpiPayment 
            amount={amount}
            appointmentId={appointmentId}
            onSuccess={onSuccess}
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Supports all UPI apps: Google Pay, PhonePe, Paytm, BHIM</p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;