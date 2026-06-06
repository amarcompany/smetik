import React, { useState, useEffect } from 'react';
import { MOCK_BANNERS } from '../data';
import { ShimmerBanner } from './Shimmer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSliderProps {
  isLoading: boolean;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ isLoading }) => {
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % MOCK_BANNERS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return <ShimmerBanner />;
  }

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? MOCK_BANNERS.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrent((prev) => (prev + 1) % MOCK_BANNERS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Minimum swipe distance threshold (50px)
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div
      id="banner-slider"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-44 rounded-[24px] overflow-hidden group select-none shadow-soft border border-gray-50/50"
    >
      {/* Scrollable track for smooth sliding logic */}
      <div 
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {MOCK_BANNERS.map((banner) => (
          <div key={banner.id} className="relative w-full h-full flex-shrink-0">
            {/* Background Image */}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dark gradient overlay for extreme text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent flex flex-col justify-end p-5" />

            {/* Texts content overlay */}
            <div className="absolute bottom-5 left-5 right-5 text-white z-10">
              <span className="text-[10px] font-bold tracking-widest uppercase text-light-accent mb-1 block">
                {banner.subtitle}
              </span>
              <h3 className="text-base font-extrabold leading-tight font-sans tracking-tight max-w-[85%]">
                {banner.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Left Arrow */}
      <button
        id="btn-banner-prev"
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/35 hover:bg-white/50 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-sm"
        aria-label="Previous Banner"
      >
        <ChevronLeft size={15} />
      </button>

      {/* Navigation Right Arrow */}
      <button
        id="btn-banner-next"
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/35 hover:bg-white/50 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-sm"
        aria-label="Next Banner"
      >
        <ChevronRight size={15} />
      </button>

      {/* Bullet Indicators: Active and Inactive states */}
      <div className="absolute bottom-4 right-5 flex gap-1.5 z-20">
        {MOCK_BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
              idx === current ? 'w-5 bg-light-accent' : 'w-1.5 bg-white/50'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
