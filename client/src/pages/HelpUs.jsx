import React from 'react';

const HelpUs = () => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 min-h-screen text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Help Us</h1>
      <p className="mb-4">If you are experiencing any issues with the website, booking process, or need to reschedule, please reach out to us!</p>
      
      <div className="bg-[#151515] border border-gray-800 p-6 rounded-xl mt-8 max-w-md">
        <h2 className="text-xl text-white font-bold mb-4">Contact Support</h2>
        <p className="mb-2"><span className="text-[#D4AF37] font-bold">Mohd Umar:</span> 9519159639</p>
        <p><span className="text-[#D4AF37] font-bold">Mohd Arish:</span> 6393790278</p>
      </div>
    </div>
  );
};

export default HelpUs;