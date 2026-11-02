import React, { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element enters the screen, show it.
        // If it leaves the screen, hide it again (so it can re-trigger).
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;