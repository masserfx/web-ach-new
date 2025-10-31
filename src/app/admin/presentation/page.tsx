'use client';

import { useState, useEffect } from 'react';
import PresentationSlide from '@/components/presentation/PresentationSlide';
import SlideNavigation from '@/components/presentation/SlideNavigation';
import ThemeToggle from '@/components/presentation/ThemeToggle';
import Slide1Intro from '@/components/presentation/slides/Slide1Intro';
import Slide2Advantages from '@/components/presentation/slides/Slide2Advantages';
import Slide3Technology from '@/components/presentation/slides/Slide3Technology';
import Slide4Metrics from '@/components/presentation/slides/Slide4Metrics';
import Slide5Roadmap from '@/components/presentation/slides/Slide5Roadmap';
import Slide6Investment from '@/components/presentation/slides/Slide6Investment';
import Slide7Closing from '@/components/presentation/slides/Slide7Closing';

const SLIDES = [
  { component: Slide1Intro, title: 'Úvod a vize' },
  { component: Slide2Advantages, title: 'Konkurenční výhody' },
  { component: Slide3Technology, title: 'Technologický stack' },
  { component: Slide4Metrics, title: 'Business metriky' },
  { component: Slide5Roadmap, title: 'Implementační plán' },
  { component: Slide6Investment, title: 'Investice a ROI' },
  { component: Slide7Closing, title: 'Next steps' },
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 't' || e.key === 'T') {
        setIsDark((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen request failed:', err);
      }
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const SlideComponent = SLIDES[currentSlide].component;

  return (
    <div
      className={`w-full h-screen overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-gray-950 text-white'
          : 'bg-white text-gray-900'
      }`}
    >
      {/* Theme toggle */}
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

      {/* Main presentation area */}
      <div className="relative w-full h-full">
        <PresentationSlide
          slideNumber={currentSlide + 1}
          totalSlides={SLIDES.length}
          title={SLIDES[currentSlide].title}
          isDark={isDark}
        >
          <SlideComponent isDark={isDark} />
        </PresentationSlide>

        {/* Navigation controls */}
        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={SLIDES.length}
          onPrevious={() => setCurrentSlide(Math.max(currentSlide - 1, 0))}
          onNext={() => setCurrentSlide(Math.min(currentSlide + 1, SLIDES.length - 1))}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          isDark={isDark}
        />

        {/* Progress indicator */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-gray-300'
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
