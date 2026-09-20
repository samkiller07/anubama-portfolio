import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardCarouselProps {
  children: React.ReactNode[];
  autoSlideInterval?: number; // default 4000ms
  className?: string;
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  children,
  autoSlideInterval = 4000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const totalCards = React.Children.count(children);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const scrollToCard = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.offsetWidth;
    container.scrollTo({
      left: index * cardWidth,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
    setCurrentIndex(index);
  }, [prefersReducedMotion]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalCards;
    scrollToCard(nextIndex);
  }, [currentIndex, totalCards, scrollToCard]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    scrollToCard(prevIndex);
  }, [currentIndex, totalCards, scrollToCard]);

  // Auto-slide effect
  useEffect(() => {
    if (prefersReducedMotion || isPaused || totalCards <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, totalCards, autoSlideInterval, prefersReducedMotion, handleNext]);

  // Handle scroll snap detection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < totalCards && newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  if (totalCards === 0) return null;

  return (
    <div 
      className={`relative w-full select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        // Resume after 2 seconds
        setTimeout(() => setIsPaused(false), 2000);
      }}
    >
      {/* Carousel Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth pb-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child, idx) => (
          <div
            key={idx}
            className="w-[88vw] sm:w-[85vw] flex-shrink-0 snap-center px-1.5"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Controls & Pagination */}
      {totalCards > 1 && (
        <div className="flex items-center justify-between px-2 mt-4">
          {/* Prev Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="p-2 rounded-full bg-[#1b122c]/90 border border-pink-500/30 text-pink-300 hover:text-white hover:border-pink-500 hover:bg-pink-950/60 transition-all shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Pagination Indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalCards }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-gradient-to-r from-pink-500 to-rose-500 shadow-sm shadow-pink-500/50'
                    : 'w-2 h-2 bg-pink-500/20 hover:bg-pink-500/40'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="p-2 rounded-full bg-[#1b122c]/90 border border-pink-500/30 text-pink-300 hover:text-white hover:border-pink-500 hover:bg-pink-950/60 transition-all shadow-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
