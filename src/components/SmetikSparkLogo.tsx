import React from 'react';

interface SmetikSparkLogoProps {
  className?: string;
  size?: number;
}

export const SmetikSparkLogo: React.FC<SmetikSparkLogoProps> = ({ 
  className = '', 
  size = 24 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Elite boutique Smetik gradient representing glowing skincare and beauty therapy */}
        <linearGradient id="smetik-gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#845EC2" />
          <stop offset="45%" stopColor="#D65DB1" />
          <stop offset="75%" stopColor="#FF6F91" />
          <stop offset="100%" stopColor="#FF9671" />
        </linearGradient>
        
        {/* Shadow filter to deliver a subtle three-dimensional depth */}
        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main majestic four-pointed curved sparkle */}
      <path 
        d="M 50,6 C 50,50 50,50 94,50 C 50,50 50,50 50,94 C 50,50 50,50 6,50 C 50,50 50,50 50,6 Z" 
        fill="url(#smetik-gemini-grad)" 
        filter="url(#soft-glow)"
        className="animate-[pulse_3s_infinite_ease-in-out]"
      />

      {/* Secondary cute micro-sparkle at top-right for authentic Gemini style complexity */}
      <path 
        d="M 78,16 C 78,32 78,32 94,32 C 78,32 78,32 78,48 C 78,32 78,32 62,32 C 78,32 78,32 78,16 Z" 
        fill="url(#smetik-gemini-grad)" 
        opacity="0.85"
        className="animate-[pulse_2.2s_infinite_ease-in-out_200ms]"
      />
    </svg>
  );
};
