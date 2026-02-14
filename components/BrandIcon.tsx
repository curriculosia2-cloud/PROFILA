
import * as React from 'react';

interface BrandIconProps {
  className?: string;
  size?: number;
}

const BrandIcon: React.FC<BrandIconProps> = ({ className = "", size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-[0_0_8px_rgba(0,255,163,0.3)]`}
    >
      <defs>
        <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      
      {/* Document Shape Base */}
      <path 
        d="M25 15C25 12.2386 27.2386 10 30 10H65L85 30V85C85 87.7614 82.7614 90 80 90H30C27.2386 90 25 87.7614 25 85V15Z" 
        fill="url(#brand-gradient)"
      />
      
      {/* Lightning / Energy Flow Path */}
      <path 
        d="M45 35L65 50L40 60L60 75" 
        stroke="#00FFA3" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Tech Node (AI) */}
      <circle cx="60" cy="75" r="5" fill="#00FFA3" />
      
      {/* Decorative Circuit Lines */}
      <path 
        d="M35 25H55M35 35H40" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeOpacity="0.3"
      />
      
      {/* Folded Corner */}
      <path 
        d="M65 10V25C65 27.7614 67.2386 30 70 30H85" 
        fill="white" 
        fillOpacity="0.1"
      />
      <path 
        d="M65 10L85 30H70C67.2386 30 65 27.7614 65 25V10Z" 
        fill="white" 
        fillOpacity="0.2"
      />
    </svg>
  );
};

export default BrandIcon;
