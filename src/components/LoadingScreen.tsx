import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoaded?: () => void;
  minDuration?: number; // default 800ms for smooth aesthetic feel
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoaded,
  minDuration = 800
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 200 : minDuration;

    const timer = setTimeout(() => {
      setIsFading(true);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        if (onLoaded) onLoaded();
      }, 400); // fade duration
      return () => clearTimeout(hideTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [minDuration, onLoaded]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0612] transition-opacity duration-400 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-busy="true"
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-pink-500/15 blur-[100px] pointer-events-none animate-pulse" />

      {/* Floating Sakura Petals Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] text-pink-400/40 text-xl animate-bounce" style={{ animationDuration: '3s' }}>🌸</div>
        <div className="absolute top-[40%] right-[25%] text-rose-400/30 text-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🌸</div>
        <div className="absolute bottom-[35%] left-[30%] text-pink-300/30 text-base animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🌸</div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Sakura Blossom Mark */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Outer glowing pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/30 via-rose-500/20 to-pink-400/30 blur-md animate-pulse" />
          
          {/* Rotating decorative border */}
          <div className="absolute inset-1 rounded-full border border-pink-500/40 border-t-pink-400 animate-spin" style={{ animationDuration: '3s' }} />
          
          {/* Inner Badge */}
          <div className="relative w-16 h-16 rounded-full bg-[#150f22] border border-pink-500/50 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] select-none">
              🌸
            </span>
          </div>
        </div>

        {/* Portfolio Title & Monogram */}
        <h1 className="text-xl font-bold tracking-wider text-white mb-2 font-mono">
          ANUBAMA M
        </h1>
        <p className="text-xs text-pink-300/80 tracking-widest uppercase mb-4 flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
          <span>Software Developer</span>
        </p>

        {/* Progress Line */}
        <div className="w-44 h-1 bg-pink-950/80 rounded-full overflow-hidden border border-pink-500/20">
          <div className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 rounded-full animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
};
