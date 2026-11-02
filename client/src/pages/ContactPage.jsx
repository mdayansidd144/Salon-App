import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Reveal from '../components/Reveal';
import { salonData } from '../data/salonData';
const API_BASE = 'http://localhost:5000';
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Message sent! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Connect With Us</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Have a question or want to book a custom package? Send us a message.</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="bg-[#151515] border border-gray-800 rounded-3xl p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3 text-lg disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </Reveal>

          {/* Contact Info */}
          <Reveal delay={0.4}>
            <div className="space-y-8 h-full flex flex-col justify-center">
              <div className="bg-[#151515] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-[#D4AF37] font-bold mb-2">Our Location</h3>
                <p className="text-gray-400 text-sm">{salonData.contact.address}</p>
              </div>
              
              <div className="bg-[#151515] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-[#D4AF37] font-bold mb-2">Call Us Directly</h3>
                <p className="text-white text-sm mb-1"><span className="text-gray-500">Umar:</span> {salonData.contact.umarPhone}</p>
                <p className="text-white text-sm"><span className="text-gray-500">Arish:</span> {salonData.contact.arishPhone}</p>
              </div>

              <div className="bg-[#151515] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-[#D4AF37] font-bold mb-2">Opening Hours</h3>
                <p className="text-gray-400 text-sm">{salonData.hours}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;