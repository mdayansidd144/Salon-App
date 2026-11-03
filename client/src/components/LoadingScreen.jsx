import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset progress to 0 when the component mounts
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Once it hits 100%, wait 200ms then disappear
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 200); 
          return 100;
        }
        // Speed of the loading bar (higher number = faster loading)
        return prev + Math.floor(Math.random() * 8) + 2; 
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-[9999]">
      
      <img 
        src="/logo.jpg" 
        alt="Cut For You Logo" 
        className="w-32 h-32 object-cover mb-8 rounded-full border-2 border-[#D4AF37] bg-white" 
      />
      
      <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest mb-12 font-serif text-center">
        CUT FOR YOU
      </h1>
      
      <div className="w-64 md:w-96 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#D4AF37] transition-all duration-75 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400 mt-4 text-sm tracking-widest">{progress}%</p>
    </div>
  );
};

export default LoadingScreen;