import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[99999] bg-transparent">
      <div className="h-full bg-[#D4AF37] animate-[loading_1s_ease-in-out_infinite] origin-left"></div>
      <style>
        {`
          @keyframes loading {
            0% { transform: scaleX(0); opacity: 1; }
            50% { transform: scaleX(0.8); opacity: 1; }
            100% { transform: scaleX(1); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default PageLoader;