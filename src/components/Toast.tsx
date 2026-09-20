import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#170e24]/95 border border-pink-500/40 text-pink-100 shadow-2xl shadow-pink-950/60 backdrop-blur-xl max-w-md">
        <div className="w-6 h-6 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs sm:text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="p-1 rounded-lg text-pink-300/70 hover:text-white hover:bg-pink-950/40 transition-colors ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
