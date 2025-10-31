'use client';

import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  isDark?: boolean;
}

export default function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onToggleFullscreen,
  isFullscreen,
  isDark = true,
}: SlideNavigationProps) {
  return (
    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
      {/* Navigation buttons */}
      <button
        onClick={onPrevious}
        disabled={currentSlide === 0}
        className={`p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
            : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        }`}
        title="Předchozí slide (← nebo Shift+Space)"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Slide counter */}
      <div className={`px-8 py-3 rounded-lg transition-colors font-bold ${
        isDark
          ? 'bg-gray-700 text-gray-100'
          : 'bg-gray-300 text-gray-900'
      }`}>
        <p className="text-lg">
          {currentSlide + 1} / {totalSlides}
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className={`p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
            : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        }`}
        title="Další slide (→ nebo Space)"
      >
        <ChevronRight size={32} />
      </button>

      {/* Fullscreen button */}
      <button
        onClick={onToggleFullscreen}
        className={`p-3 rounded-lg transition-colors ml-4 ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
            : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        }`}
        title="Fullscreen (F)"
      >
        {isFullscreen ? <Minimize2 size={32} /> : <Maximize2 size={32} />}
      </button>

      {/* Keyboard hints */}
      <div className={`ml-4 hidden md:block transition-colors font-semibold ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <p className="text-base">← → Space = Navigace | F = Fullscreen | T = Téma</p>
      </div>
    </div>
  );
}
