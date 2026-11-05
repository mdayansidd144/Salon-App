import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Forces the frontend to stop waiting after 10 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Server timed out. Email might be blocked by Render.');
      } else {
        toast.error('Cannot connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen">
      <div className="max-w-xl mx-auto bg-[#151515] border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Contact Us</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-gold py-3 mt-4 disabled:opacity-70">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;