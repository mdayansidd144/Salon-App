import React, { useState } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { UpiIcon, CopyIcon, CheckIcon } from '../icons';

export const UpiPayment = ({ amount, appointmentId, onSuccess }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const merchantUPI = process.env.REACT_APP_UPI_ID || 'salonpro@okhdfcbank';
  const upiIntent = `upi://pay?pa=${merchantUPI}&pn=Salon%20Pro&am=${amount}&tn=Appointment_${appointmentId}&cu=INR`;

  const copyUPI = () => {
    navigator.clipboard.writeText(merchantUPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('UPI ID copied!');
  };

  const handleUPIPayment = () => {
    if (!upiId) {
      toast.error('Please enter UPI ID');
      return;
    }
    
    setLoading(true);
    // Create UPI intent with entered UPI ID
    const customUpiIntent = `upi://pay?pa=${upiId}&pn=Salon%20Pro&am=${amount}&tn=Appointment_${appointmentId}&cu=INR`;
    window.location.href = customUpiIntent;
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Please complete payment in your UPI app');
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {!showQR ? (
        <>
          <button
            onClick={() => setShowQR(true)}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Scan QR Code
          </button>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or pay using UPI ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter your UPI ID (e.g., name@okhdfcbank)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUPIPayment}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                Pay
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Merchant UPI ID:</p>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-blue-600">{merchantUPI}</code>
              <button
                onClick={copyUPI}
                className="text-blue-600 hover:text-blue-700"
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-700 mb-4">Scan with any UPI app to pay</p>
          <div className="bg-white p-4 inline-block rounded-lg shadow mx-auto">
            <QRCode value={upiIntent} size={180} />
          </div>
          <p className="text-xs text-gray-500 mt-4">
            After payment, it will be confirmed automatically within 2 minutes
          </p>
          <button
            onClick={() => setShowQR(false)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to other options
          </button>
        </div>
      )}
    </div>
  );
};