import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPaymentOrder, verifyPayment } from '../services/api';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await createPaymentOrder(appointmentId);

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: "Men's Salon Pro",
            description: 'Appointment Payment',
            order_id: data.orderId,
            handler: async (resp) => {
              try {
                await verifyPayment({
                  razorpay_order_id: resp.razorpay_order_id,
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature,
                  appointmentId
                });
                toast.success('Payment successful! Appointment confirmed.');
                navigate('/');
              } catch {
                toast.error('Verification failed');
              }
            },
            prefill: { name: '', email: '', contact: '' },
            theme: { color: '#D4AF37' },
            modal: {
              ondismiss: () => {
                toast.error('Payment cancelled');
                navigate('/');
              }
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } catch (err) {
        toast.error('Failed to start payment');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [appointmentId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-900 font-semibold">{loading ? 'Connecting to Secure Gateway...' : 'Redirecting...'}</p>
      </div>
    </div>
  );
};

export default PaymentPage;